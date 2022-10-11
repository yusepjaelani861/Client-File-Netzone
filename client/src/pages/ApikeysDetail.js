import { Tab } from '@headlessui/react'
import { Progress } from '@material-tailwind/react';
import { removeCookie } from 'assets/utils/helper';
import { notify } from 'assets/utils/helper';
import { formatSize } from 'assets/utils/helper';
import { formatDate } from 'assets/utils/helper';
import { convertNumberToString } from 'assets/utils/helper';
import { getCookie } from 'assets/utils/helper';
import LoadingScreen from 'components/LoadingScreen';
import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height'
import { NavLink, useParams } from 'react-router-dom';
import NotFound from './NotFound';

export default function ApikeysDetail() {
    const params = useParams();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [heightFtp, setHeightFtp] = useState(0);
    const [heightSftp, setHeightSftp] = useState(0);
    const [heightS3, setHeightS3] = useState(0);

    const [config, setConfig] = useState({
        max_file_size: 0,
        max_files_per_request: 0,
        primary_storage: 'local',
        ftp_host: '',
        ftp_port: '',
        ftp_username: '',
        ftp_password: '',
        sftp_host: '',
        sftp_port: '',
        sftp_username: '',
        sftp_password: '',
        s3_key: '',
        s3_secret: '',
        s3_bucket: '',
        s3_region: '',
        s3_endpoint: '',
    });

    const [api, setApi] = useState({
        domain: '',
        secret_key: '',
        public_key: '',
        file_key: '',
        max_file_size: 0,
        max_files_per_request: 0,
        total_storage_used: 0,
        max_storage: 0,
        created_at: '',
    })

    useEffect(() => {
        // const token = getCookie('token');
        // if (token === '' || token === undefined) {
        //     window.location.href = '/login';
        // }

        setLoading(true);
        
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/config/get/${params.domain}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie("token")}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success === true) {
                        setConfig(data.data.config);
                        setApi(data.data.api);
                        setLoading(false);
                        if (data.data.config.primary_storage === 'ftp') {
                            setHeightFtp('auto');
                        } else if (data.data.config.primary_storage === 'sftp') {
                            setHeightSftp('auto');
                        } else if (data.data.config.primary_storage === 's3') {
                            setHeightS3('auto');
                        }
                    } else if (data.error.error_code === 0) {
                        removeCookie("token");
                        window.location.href = '/login';
                    } else {
                        setLoading(false);
                        document.getElementById('isi').remove()
                        setError(true);
                        notify(data.message);
                    }
                })
                .catch(err => {
                    setLoading(false)
                    notify(err.message)
                })
            } catch (err) {
                setLoading(false)
                notify(err.message)
            }
        }, 200)
    }, [params.domain]);

    const handleChangeSelect = (value) => {
        setTimeout(() => {
            setHeightFtp(0);
            setHeightSftp(0);
            setHeightS3(0);
        }, 100)

        setTimeout(() => {
            if (value === 'local') {
                setHeightFtp(0);
                setHeightSftp(0);
                setHeightS3(0);
            } else if (value === 'ftp') {
                setHeightFtp(heightFtp === 0 ? 'auto' : 0);
            } else if (value === 'sftp') {
                setHeightSftp(heightSftp === 0 ? 'auto' : 0);
            } else if (value === 's3') {
                setHeightS3(heightS3 === 0 ? 'auto' : 0);
            }
        }, 700)
    }

    const handleSaveConfig = () => {
        setLoadingSave(true);
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/keys/config/edit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie("token")}`
                    },
                    body: JSON.stringify(config)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success === true) {
                        notify(data.message);
                        setLoadingSave(false);
                    } else if (data.error.error_code === 0) {
                        removeCookie("token");
                        window.location.href = '/login';
                    } else {
                        notify(data.message);
                        setLoadingSave(false);
                    }
                })
                .catch((err) => {
                    setLoadingSave(false)
                    notify(err.message)
                })
            } catch (error) {
                setLoading(false)
                notify(error.message)
            }
        }, 200)
    }
  return (
    <>  
    
    {error ? (
        <NotFound />
    ) : (
        <></>
    )}
    <div id="isi" className='px-3 md:px-8 h-auto mt-20'>
    {loading ? (
        <LoadingScreen />
    ) : (
        <></>
    )}
    {/* Back to page */}
    <div className='flex items-center mb-5'>
        <NavLink to='/apikey'>
            <div className='flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M7.293 10.707a1 1 0 011.414 0L10 12.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 5a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className='text-sm font-medium'>Back to API Keys</p>
            </div>
        </NavLink>
    </div>
    <Tab.Group>
      <Tab.List className="flex p-1 space-x-1 bg-gray-200 space-x-1 rounded">
        <Tab className="flex-1 text-center py-2.5 text-sm font-medium rounded text-gray-700 bg-white border border-gray-300">Details</Tab>
        <Tab className="flex-1 text-center py-2.5 text-sm font-medium rounded text-gray-700 bg-white border border-gray-300">Config</Tab>
        <Tab className="flex-1 text-center py-2.5 text-sm font-medium rounded text-gray-700 bg-white border border-gray-300">Documentation</Tab>
      </Tab.List>
      <Tab.Panels className="mt-2 bg-white rounded-lg shadow-lg">
        <Tab.Panel className="p-4 text-gray-700">
            <div className="container mx-auto">
                <div className="xl:col-start-1 xl:col-end-5">
                    <div className="bg-white border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                API Key Details
                            </h3>
                        </div>
                        <div className="relative p-6 flex-auto">
                            <p className="my-4 text-gray-600 text-lg leading-relaxed">
                                <span className="font-semibold">Name:</span> <span className="text-gray-400">{api.domain}</span>
                            </p>
                            <p className="my-4 text-gray-600 text-lg leading-relaxed">
                                <span className="font-semibold">Secret Key:</span> <span className="text-gray-400">{api.secret_key}</span>
                            </p>
                            <p className="my-4 text-gray-600 text-lg leading-relaxed">
                                <span className="font-semibold">Public Key:</span> <span className="text-gray-400">{api.public_key}</span>
                            </p>
                            <p className="my-4 text-gray-600 text-lg leading-relaxed">
                                <span className="font-semibold">Created:</span> <span className="text-gray-400">{formatDate(api.created_at)}</span>
                            </p>
                            <p className="my-4 text-gray-600 text-lg leading-relaxed">
                                <span className="font-semibold">Total Storage Used:</span> <span className="text-gray-400">{formatSize(api.total_storage_used)}</span>
                            </p>
                            {/* Progress bar storage usage */}
                            <div className="relative pt-1"> 
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 justify-center">
                                <Progress value={convertNumberToString(api.total_storage_used / api.max_storage * 100)} color="green" />
                                {/* available storage */}
                                {/* <div className="flex flex-col text-center whitespace-nowrap text-white justify-center">
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                        {api.max_file_size - api.total_storage_used} MB
                                    </span>
                                </div> */}
                            </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Tab.Panel>
        <Tab.Panel className="p-4 text-gray-700">
            <div className="container mx-auto">
                <div className="xl:col-start-1 xl:col-end-5">
                    <div className="bg-white border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Configuration
                            </h3>
                        </div>
                        <div className="relative p-6 flex-auto">
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                            Max Upload Size
                                        </label>
                                        <input 
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                            type="number" 
                                            placeholder="API Key Name" 
                                            value={config.max_file_size}
                                            onChange={(e) => setConfig({...config, max_file_size: e.target.value})}    
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                            Max Files Upload
                                        </label>
                                        <input 
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                            type="number" 
                                            placeholder="API Key Name" 
                                            value={config.max_files_per_request}
                                            onChange={(e) => setConfig({...config, max_files_per_request: e.target.value})}    
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                            Primary Storage
                                        </label>
                                        <select id="disk" 
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                            value={config.primary_storage}
                                            onChange={(e) => {
                                                setConfig({...config, primary_storage: e.target.value})
                                                handleChangeSelect(e.target.value)
                                            }}
                                            >
                                            <option value="local">Local</option>
                                            <option value="ftp">FTP</option>
                                            <option value="sftp">SFTP</option>
                                            <option value="s3">AWS S3</option>
                                        </select>
                                        
                                    </div>
                                </div>

                                <div id="con" className="h-auto">
                                    <AnimateHeight id="ftp" duration={ 500 } height={ heightFtp }>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    FTP Host
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="FTP_HOST" 
                                                    value={config.ftp_host}
                                                    onChange={(e) => setConfig({...config, ftp_host: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    FTP Username
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="FTP_USERNAME" 
                                                    value={config.ftp_username}
                                                    onChange={(e) => setConfig({...config, ftp_username: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    FTP Password
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="FTP_PASSWORD" 
                                                    value={config.ftp_password}
                                                    onChange={(e) => setConfig({...config, ftp_password: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    FTP Port
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="FTP_PORT" 
                                                    value={config.ftp_port}
                                                    onChange={(e) => setConfig({...config, ftp_port: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                    </AnimateHeight>

                                    <AnimateHeight id="sftp" duration={ 500 } height={ heightSftp }>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    SFTP Host
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="SFTP_HOST" 
                                                    value={config.sftp_host}
                                                    onChange={(e) => setConfig({...config, sftp_host: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    SFTP Username
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="SFTP_USERNAME" 
                                                    value={config.sftp_username}
                                                    onChange={(e) => setConfig({...config, sftp_username: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    SFTP Password
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="password" 
                                                    placeholder="SFTP_PASSWORD" 
                                                    value={config.sftp_password}
                                                    onChange={(e) => setConfig({...config, sftp_password: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    SFTP Port
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="SFTP_PORT" 
                                                    value={config.sftp_port}
                                                    onChange={(e) => setConfig({...config, sftp_port: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                    </AnimateHeight>

                                    <AnimateHeight id="s3" duration={ 500 } height={ heightS3 }>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    S3 Bucket
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="S3_BUCKET" 
                                                    value={config.s3_bucket}
                                                    onChange={(e) => setConfig({...config, s3_bucket: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    S3 Access Key
                                                </label>
                                                <input 
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                                    type="text" 
                                                    placeholder="S3_ACCESS_KEY" 
                                                    value={config.s3_key}
                                                    onChange={(e) => setConfig({...config, s3_key: e.target.value})}    
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    S3 Secret Key
                                                </label>
                                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="S3_SECRET_KEY" />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    S3 Region
                                                </label>
                                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="S3_REGION" />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    S3 URL
                                                </label>
                                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="S3_URL" />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3">
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    S3 Endpoint
                                                </label>
                                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="S3_ENDPOINT" />
                                            </div>
                                        </div>
                                    </AnimateHeight>
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-4 mt-2">
                                    <div className="w-full px-3 flex justify-end items-center">
                                        <button 
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                            type="button"
                                            onClick={handleSaveConfig}    
                                        >
                                            {loadingSave ? 'Loading ...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </Tab.Panel>
        <Tab.Panel className="p-4 text-gray-700">
        <div className="container mx-auto">
                <div className="xl:col-start-1 xl:col-end-5">
                    <div className="bg-white border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Documentation Usage
                            </h3>
                        </div>
                        <div className="relative p-6 flex-auto">
                            <div className="my-4 text-gray-600 text-lg leading-relaxed">
                                <p className="mt-4">
                                    If you want use automatic script for upload file on this API, please follow this step.
                                </p>
                                <p className="mt-4">
                                    Add this script to specific location tag in your HTML file.
                                </p>
                                <div className="mt-4">
                                    <pre className="bg-gray-800 text-white p-4 rounded w-full overflow-auto">
                                    <code>
                                        {`<div id="nearven-upload"></div>`}
                                    </code>
                                    </pre>
                                </div>

                                <p className="mt-4">
                                    Add this script to your body tag.
                                </p>
                                <div className="mt-4">
                                    <pre className="bg-gray-800 text-white p-4 rounded w-full overflow-auto">
                                    <code>
                                        {`<script src="${process.env.REACT_APP_BACKEND_URL}/data/assets/js/${api.file_key}.js"></script>`}
                                    </code>
                                    </pre>
                                </div>
                            </div>
                            <p className="my-4 text-gray-600 text-lg leading-relaxed">
                                Or you can use this endpoint to upload file directly.
                            </p>
                            <div className="mt-4">
                                <pre className="bg-gray-800 text-white p-4 rounded w-full overflow-auto">
                                <code>
                                    {`${process.env.REACT_APP_BACKEND_URL}/api/v1/upload/{handle}`}
                                </code>
                                </pre>
                            </div>
                            {/* Note */}
                            <div className="mt-4 text-gray-600 text-lg leading-relaxed w-full overflow-auto">
                                <p className="mb-4">
                                    Note :
                                </p>
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="border">
                                            <th className="px-4 py-2">Handle</th>
                                            <th className="px-4 py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border text-center">
                                            <td className="px-4 py-2"><code>single</code></td>
                                            <td className="px-4 py-2">Upload single file</td>
                                        </tr>
                                        <tr className="border text-center">
                                            <td className="px-4 py-2"><code>multiple</code></td>
                                            <td className="px-4 py-2">For upload multiple file</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    </div>
    </>
  )
}
