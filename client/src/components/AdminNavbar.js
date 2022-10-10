import { useLocation } from 'react-router-dom';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';

export default function AdminNavbar({ showSidebar, setShowSidebar }) {
    const location = useLocation().pathname;

    return (
        <nav className="bg-light-blue-500 md:ml-64 py-6 px-3">
            <div className="container max-w-full mx-auto flex items-center justify-between md:pr-8 md:pl-10">
                <div className="md:hidden">
                    <Button
                        color="transparent"
                        buttonType="link"
                        size="lg"
                        iconOnly
                        rounded
                        ripple="light"
                        onClick={() => setShowSidebar('left-0')}
                    >
                        <Icon name="menu" size="2xl" color="white" />
                    </Button>
                    <div
                        className={`absolute top-2 md:hidden ${
                            showSidebar === 'left-0' ? 'left-64' : '-left-64'
                        } z-50 transition-all duration-300`}
                    >
                        <Button
                            color="transparent"
                            buttonType="link"
                            size="lg"
                            iconOnly
                            rounded
                            ripple="light"
                            onClick={() => setShowSidebar('-left-64')}
                        >
                            <Icon name="close" size="2xl" color="white" />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center w-full">
                    <h4 className="uppercase text-white text-2xl font-bold tracking-wider mt-1">
                        {location === '/'
                            ? 'DASHBOARD'
                            : location.toUpperCase().replace('/', '')}
                    </h4>

                    {/* <div className="flex">

                        <div className="-mr-4 ml-6">
                            <Dropdown
                                color="transparent"
                                buttonText={
                                    <div className="w-12">
                                        <Icon name="person" size="2xl" color="white" />
                                    </div>
                                }
                                rounded
                                style={{
                                    padding: 0,
                                    color: 'transparent',
                                }}
                            >
                                {getCookie("token") === "" || getCookie("token") === undefined ? (
                                    <>
                                        <NavLink 
                                                to="/login"
                                            >
                                        <DropdownItem
                                            color="lightBlue"
                                            ripple="light"
                                        >
                                            Login
                                        </DropdownItem>
                                        </NavLink>
                                    </>
                                ) : (
                                    <>
                                        <button className="w-full">
                                            <DropdownItem color="lightBlue">
                                                Settings
                                            </DropdownItem>
                                        </button>
                                        <button className="w-full" onClick={handleLogout}>
                                            <DropdownItem color="lightBlue">
                                                Logout
                                            </DropdownItem>
                                        </button>
                                    </>
                                )}
                            </Dropdown>
                        </div>
                    </div> */}
                </div>
            </div>
        </nav>
    );
}
