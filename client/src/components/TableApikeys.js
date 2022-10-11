import Card from '@material-tailwind/react/Card';
import CardBody from '@material-tailwind/react/CardBody';
import { useEffect, useState } from 'react';
import { getCookie } from 'assets/utils/helper';
import { removeCookie } from 'assets/utils/helper';
import { Button, Icon } from '@material-tailwind/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { notify } from 'assets/utils/helper';
import copy from 'copy-to-clipboard';
import LoadingScreen from './LoadingScreen';
import { NavLink } from 'react-router-dom';

export default function TableApikeys() {
    const [loading, setLoading] = useState(true)
    const [loadingCreate, setLoadingCreate] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [data, setData] = useState([])
    let [isOpen, setIsOpen] = useState(false)
    let [apiName, setApiName] = useState('')
    let [error, setError] = useState(null)
    // const [paginate, setPaginate] = useState({
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
        let token = getCookie("token")
        if (token === "" || token === undefined) {
            window.location.href = "/login"
        }
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/list`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie('token')}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success === true) {
                        setData(data)
                        setLoading(false)
                    } else if (data.error.error_code === 0) {
                        removeCookie("token");
                        window.location.href = "/login";
                    } else {
                        throw new Error(data.message)
                    }
                })
                .catch(err => {
                    throw new Error(err)
                })
            } catch (err) {
                throw new Error(err)
            }
        }, 500)
    }, [])

    const handlePagination = (page) => {
        setLoading(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/list?page=${page}`, {
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
        }, 500)
    }

    const openModal = () => {
        setIsOpen(true)
        setApiName('')
        document.getElementById("name-api").value = ""
    }

    const handleCreateAPI = () => {
        setLoadingCreate(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    },
                    body: JSON.stringify({
                        name: apiName
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        handlePagination(1)
                        setLoadingCreate(false)
                        setIsOpen(false)
                    } else if (data.error.error_code === 0) {
                        // remove token
                        removeCookie("token")
                        window.location.href = "/login"
                    } else if (data.error.error_code === 'PROCESS_ERROR') {
                        setLoadingCreate(false)
                        setError(data.message)
                    }
                })
                .catch((err) => {
                    throw new Error(err)
                })
            } catch (error) {
                throw error
            }
        }, 500)
    }

    const handleDeleteAPI = (id) => {
        setLoadingDelete(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/delete/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        notify('Deleted has been successfully');
                        handlePagination(1)
                        setLoadingDelete(false)
                    } else if (data.error.error_code === 0) {
                        // remove token
                        removeCookie("token")
                        window.location.href = "/login"
                    } else if (data.error.error_code === 'PROCESS_ERROR') {
                        setLoadingDelete(false)
                        notify(data.message);
                    }
                })
                .catch((err) => {
                    throw new Error(err)
                })
            } catch (error) {
                throw error
            }
        }, 500)
    }

    const handleSearch = (search) => {
        setLoading(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/search?name=${search}`, {
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
                    } else {
                        notify(data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            } catch (error) {
                throw error
            }
        }, 500)
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
                    Create API Key
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
                                        Create API Key
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to create API Key? Please add another domain for your API Key.
                                        </p>

                                        <div className="mt-4">
                                            <input id="name-api" type="text" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" placeholder="domain.com" onChange={(e) => setApiName(e.target.value)} />
                                        </div>

                                        {error ? (
                                            <div className="mt-4">
                                                <p className="text-sm text-red-500">
                                                    {error}
                                                </p>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => {
                                    handleCreateAPI()
                                }}
                            >
                                {loadingCreate ? "Creating ..." : "Create"}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={
                                    () => {
                                        setIsOpen(false)
                                    }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            

            <Card>
                <div className="flex justify-between bg-purple-500 text-white p-4 rounded-lg shadow-sm">
                    <h1 className="text-white text-2xl">List API</h1>
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
                    <div className="overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Domain
                                    </th>
                                    <th className="px-2 w-[250px] text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Secret Key
                                    </th>
                                    <th className="px-2 w-[250px] text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Public Key
                                    </th>
                                    <th className="px-2 w-[250px] text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Javascript URL
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    // <tr>
                                    //     <td colSpan="5" className="text-center">
                                    //         <div className="flex justify-center">
                                    //             <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
                                    //         </div>
                                    //     </td>
                                    // </tr>
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            <LoadingScreen />
                                        </td>
                                    </tr>
                                ) : (
                                    data.data.map((item, index) => (
                                        <tr key={index}>
                                            <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                {item.domain}
                                            </th>
                                            <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                <div className="flex w-[200px] items-center">
                                                    <p id="secret-key" className="truncate">{item.secret_key}</p>
                                                    <button
                                                        className="ml-2 text-gray-600 hover:gray-800"
                                                        onClick={() => {
                                                            copy(item.secret_key);
                                                            notify('Copied to clipboard');
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:bg-gray-400 rounded-sm">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {/* {item.secret_key} */}
                                            </th>
                                            <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                <div className="flex w-[200px] items-center">
                                                    <p id="secret-key" className="truncate">{item.public_key}</p>
                                                    <button
                                                        className="ml-2 text-gray-600 hover:gray-800"
                                                        onClick={() => {
                                                            copy(item.public_key);
                                                            notify('Copied to clipboard');
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:bg-gray-400 rounded-sm">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {/* {item.public_key} */}
                                            </th>
                                            <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                <div className="flex w-[200px] items-center">
                                                    <p id="javascript-url" className="truncate">{process.env.REACT_APP_BACKEND_URL}/data/assets/js/{item.file_key}.js</p>
                                                    <button
                                                        className="ml-2 text-gray-600 hover:gray-800"
                                                        onClick={() => {
                                                            copy(`${process.env.REACT_APP_BACKEND_URL}/data/assets/js/${item.file_key}.js`);
                                                            notify('Copied to clipboard');
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:bg-gray-400 rounded-sm">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </th>
                                            <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left grid grid-cols-2">
                                                <div className="flex items-center">
                                                    <NavLink
                                                        to={`/apikey/${item.domain}`}
                                                        className="flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal bg-transparent text-purple-500 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100 border border-purple-500 hover:bg-purple-500 hover:text-white mr-2"
                                                    >
                                                        {/* <Icon name="edit" size="xl" /> */}
                                                        Edit
                                                    </NavLink>
                                                    <Button
                                                        color="red"
                                                        buttonType="link"
                                                        ripple="light"
                                                        className="border border-red-500 hover:bg-red-500 hover:text-white mr-2"
                                                        onClick={() => {
                                                            handleDeleteAPI(item.id)
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </th>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
    )
}