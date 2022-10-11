import Card from '@material-tailwind/react/Card';
import CardBody from '@material-tailwind/react/CardBody';
import { Button, Icon } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { formatSize } from "assets/utils/helper";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { getCookie } from 'assets/utils/helper';
import { removeCookie } from 'assets/utils/helper';
import LoadingScreen from './LoadingScreen';
import { notify } from 'assets/utils/helper';

export default function CardTable({page}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    // const [setPaginate] = useState({
    //     current_page: 1,
    //     first_page_url: '',
    //     from: 1,
    //     last_page: 1,
    //     last_page_url: '',
    //     next_page_url: '',
    //     per_page: 10,
    //     prev_page_url: '',
    //     to: 1,
    //     total: 0,
    // });

    useEffect(() => {
        // const token = getCookie('token')
        // if (token === "" || token === undefined) {
        //     window.location.href = "/login";
        // }
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/files/list${page}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        setData(data);
                        setLoading(false)
                        let script = document.createElement('script')
                        script.src = `${process.env.REACT_APP_BACKEND_URL}/data/assets/js/${data.data.upload}.js`
                        document.body.appendChild(script)
                    } else if (data.error.error_code === 0) {
                        removeCookie("token")
                        window.location.href = "/login"
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            } catch (error) {
                throw error
            }
        }, 200)
    }, [page])

    const handlePagination = (page) => {
        setLoading(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/files/list?page=${page}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        setData(data);
                        setLoading(false)
                    } else if (data.error.error_code === 0) {
                        // remove token
                        removeCookie("token")
                        window.location.href = "/login"
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            } catch (error) {
                throw error
            }
        }, 200)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    const handleDeleteFile = (id) => {
        setLoadingDelete(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/files/delete/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        handlePagination(1)
                        setLoadingDelete(false)
                    } else if (data.error.error_code === 0) {
                        removeCookie("token")
                        window.location.href = "/login"
                    }
                })
                .catch((err) => {
                    throw err
                })
            } catch (err) {
                throw err
            }
        }, 200)
    }

    const handleSearch = (search) => {
        setLoading(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/files/search?name=${search}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        setData(data);
                        setLoading(false)
                    } else if (data.error.error_code === 0) {
                        removeCookie("token")
                        window.location.href = "/login"
                    } else {
                        notify(data.message)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            } catch (error) {
                throw error
            }
        }, 200)
    }

    return (
        <>
            <div className="flex justify-end py-3">
                <Button
                    color="lightBlue"
                    buttonType="filled"
                    size="regular"
                    rounded={false}
                    block={false}
                    iconOnly={false}
                    ripple="light"
                    className="w-1/7"
                    onClick={openModal}
                >
                    <Icon name="add" size="2xl" />
                    Upload Files
                </Button>
            </div>

            {loadingDelete ? (
                <LoadingScreen />
            ) : (
                <></>
            )}

            {/* Modal */}
            <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Upload Files
                                    </h3>
                                    <div id="nearven-upload" className="mt-2 w-[450px] h-[500px] overflow-auto">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={
                                    () => {
                                        handlePagination(1)
                                        setIsOpen(false)
                                    }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <Card>
            <div className="flex justify-between bg-purple-500 text-white p-4 rounded-lg shadow-sm">
                <h1 className="text-white text-2xl">List Files</h1>
                <div className="relative w-64">
                    <input
                        type="text"
                        className="px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                        placeholder="Search"
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                handleSearch(e.target.value)
                            }
                        }}
                    />
                    <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                        <Icon name="search" size="2xl" />
                    </button>
                </div>
            </div>
            <CardBody>
                <div className="overflow-auto h-[58vh]">
                    <div className="items-center w-full bg-transparent border-collapse">
                        <div className="flex lg:grid lg:grid-cols-5">
                                <div className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-center">
                                    API
                                </div>
                                <div className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-center">
                                    Filename
                                </div>
                                <div className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-center">
                                    Size
                                </div>
                                <div className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-center">
                                    Mime Type
                                </div>
                                <div className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-center">
                                    Action
                                </div>
                        </div>
                        
                            <div className="overflow-auto w-full">

                            {loading ? (
                                // <div className="flex justify-center items-center">
                                //     <div className="text-center">
                                //         <div className="flex justify-center">
                                //             <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
                                //         </div>
                                //     </div>
                                // </div>
                                <LoadingScreen />
                            ) : data.data.files.length > 0 ? (
                                data.data.files.map((item, index) => (
                                    <div className="flex lg:grid lg:grid-cols-5 items-center" key={index}>
                                        <div className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">
                                            {item.api.domain}
                                        </div>
                                        <div title={item.name} className="border-b border-gray-200 align-middle font-light text-sm px-2 py-4 text-left flex-wrap truncate">
                                            {item.name}
                                        </div>
                                        <div className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">
                                            <i className="fas fa-circle fa-sm text-orange-500 mr-2"></i>{' '}
                                            {formatSize(item.size)}
                                        </div>
                                        <div className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center truncate">
                                            {item.mime_type}
                                        </div>
                                        <div className="flex justify-center items-center border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">
                                                <Button
                                                    color="purple"
                                                    buttonType="link"
                                                    ripple="light"
                                                    className="px-1.5"
                                                    onClick={() => window.open(`${process.env.REACT_APP_BACKEND_URL}/download/${item.url}`, '_blank')}
                                                >
                                                    <Icon name="download" size="xl" />
                                                </Button>
                                                <Button
                                                    color="purple"
                                                    buttonType="link"
                                                    ripple="light"
                                                    className="px-1.5"
                                                    onClick={() => handleDeleteFile(item.id)}
                                                >
                                                    <Icon name="delete" size="xl" />
                                                </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center">
                                    <div className="text-center">
                                        <div className="flex justify-center">
                                            <div className="text-center">
                                                <div className="flex justify-center p-4">
                                                    No data
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            </div>
                    </div>
                </div>
                    {loading ? (
                        <div className="hidden justify-center items-center h-[58vh]">
                            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mb-4"></div>
                        </div>
                    ) : (
                        // <Pagination pagination={data.pagination} />
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a
                                href={data.pagination.prev_page_url}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                Previous
                                </a>
                                <a
                                href={data.pagination.next_page_url}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                Next
                                </a>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{data.pagination.current_page}</span> to{" "}
                                    <span className="font-medium">{data.pagination.to}</span> of{" "}
                                    <span className="font-medium">{data.pagination.total}</span> results
                                </p>
                                </div>
                                <div>
                                <nav
                                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                    aria-label="Pagination"
                                >
                                    {data.pagination.prev_page_url ? (
                                        <button
                                            onClick={() => handlePagination(data.pagination.current_page - 1 > 0 ? data.pagination.current_page - 1 : 1)}
                                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />Prev
                                    </button>
                                    ) : (
                                        <></>
                                    )}
                                    {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                                    {data.pagination.next_page_url ? (
                                        <button
                                            onClick={() => handlePagination(data.pagination.current_page + 1 > data.pagination.last_page ? data.pagination.last_page : data.pagination.current_page + 1)}
                                            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                            >
                                            <span className="sr-only">Next</span>
                                            Next<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </nav>
                                </div>
                            </div>
                            </div>
                    )}
            </CardBody>
        </Card>
        </>
    );
}
