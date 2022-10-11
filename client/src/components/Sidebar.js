import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Icon from '@material-tailwind/react/Icon';
import H6 from '@material-tailwind/react/Heading6';
import { getCookie } from 'assets/utils/helper';
import { Button } from '@material-tailwind/react';
import { removeCookie } from 'assets/utils/helper';
import ProfileCard from './ProfileCard';

export default function Sidebar() {
    const [showSidebar, setShowSidebar] = useState('-left-64');
    const [user, setUser] = useState({
        role_id: 1,
        username: '',
        name: '',
        avatar: '',
        role: {
            id: 1,
            name: 'Member'
        }
    })

    let token = getCookie('token')

    useEffect(() => {
        if (token !== '' && token !== undefined) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success === true) {
                    setUser(data.data)
                } else if (data.error.error_code === 0) {
                    removeCookie('token')
                    window.location.href = '/login'
                } else {
                    removeCookie('token')
                    window.location.href = '/login'
                }
            })
        }
    }, [token])

    const handleLogout = () => {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getCookie('token')}`,
                }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    removeCookie('token');
                    window.location.href = '/login';
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((err) => {
                throw new Error(err);
            })
        } catch (err) {
            throw err;
        }
    }

    return (
        <>
            <AdminNavbar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />
            <div
                className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-64 z-10 py-4 px-6 transition-all duration-300`}
            >
                <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
                    <NavLink
                        to="/"
                        className="mt-2 text-center w-full inline-block"
                    >
                        <H6 color="gray">Files Netzone</H6>
                    </NavLink>
                    <div className="flex flex-col">
                        <hr className="my-4 min-w-full" />
                        {token !== '' && token !== undefined ? (
                            <ProfileCard user={user} />
                        ) : (<></>)}

                        <ul className="flex-col min-w-full flex list-none mt-5">
                            {getCookie("token") === "" || getCookie("token") === undefined ? (
                                <>
                                    <li className="rounded-lg mb-4">
                                        <NavLink
                                            to="/"
                                            exact
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="home" size="2xl" />
                                            Home
                                        </NavLink>
                                    </li>
                                    <li className="rounded-lg mb-2 text-gray-700 hover:bg-gray-300">
                                        <NavLink
                                            to="/login"
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="fingerprint" size="2xl" />
                                            Login
                                        </NavLink>
                                    </li>
                                    <li className="rounded-lg mb-2 text-gray-700 hover:bg-gray-300">
                                        <NavLink
                                            to="/register"
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="fingerprint" size="2xl" />
                                            Register
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="rounded-lg mb-4">
                                        <NavLink
                                            to="/dashboard"
                                            exact
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="dashboard" size="2xl" />
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li className="rounded-lg mb-2">
                                        <NavLink
                                            to="/apikey"
                                            exact
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="api" size="2xl" />
                                            API Keys
                                        </NavLink>
                                    </li>
                                    <li className="rounded-lg mb-2 ">
                                        <NavLink
                                            to="/files"
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="toc" size="2xl" />
                                            List Files
                                        </NavLink>
                                    </li>
                                    <li className="rounded-lg mb-2">
                                        <NavLink
                                            to="/settings"
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="settings" size="2xl" />
                                            Settings
                                        </NavLink>
                                    </li>
                                    <li className="rounded-lg mb-2">
                                        <NavLink
                                            to="/account"
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                            activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                                        >
                                            <Icon name="account_circle" size="2xl" />
                                            Account
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>

                        <ul className="flex-col min-w-full flex list-none absolute bottom-0">
                            {getCookie("token") !== "" && getCookie("token") !== undefined ? (
                                <>
                                    <li className="rounded-lg mb-2">
                                        <NavLink
                                            to="/docs"
                                            target="_blank"
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                        >
                                            <Icon name="book" size="2xl" />
                                            Documentation API
                                        </NavLink>
                                    </li>
                                    <li className="rounded-lg mb-2">
                                        <Button 
                                            onClick={handleLogout}
                                            className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg w-full"
                                        >
                                            <Icon name="logout" size="2xl" />
                                            Logout
                                        </Button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="rounded-lg mb-2">
                                        <NavLink
                                            to="/docs"
                                            target="_blank"
                                            className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-4 py-3 rounded-lg"
                                        >
                                            <Icon name="book" size="2xl" />
                                            Documentation API
                                        </NavLink>
                                    </li>  
                                </>
                            )}
                            {/* <li className="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 px-4 rounded-lg text-white mb-2">
                                <a
                                    href="https://material-tailwind.com/documentation/quick-start"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-4 text-sm font-light py-3"
                                >
                                    <Icon name="description" size="2xl" />
                                    Documentation
                                </a>
                            </li>
                            <li className="bg-gradient-to-tr from-purple-500 to-purple-700 px-4 rounded-lg text-white">
                                <a
                                    href="https://www.creative-tim.com/product/material-tailwind-dashboard-react"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-4 text-sm font-light py-3"
                                >
                                    Free Download
                                </a>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
