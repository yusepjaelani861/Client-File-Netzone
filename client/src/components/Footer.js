import { NavLink } from "react-router-dom";

export default function footer() {
    return (
        <footer className="py-6 px-16 border-t border-gray-200 font-light flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-700 mb-6 lg:mb-0">
                Copyright &copy; {new Date().getFullYear()}{' '}
                <a
                    href="https://nearven.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-light-blue-500 hover:text-light-blue-700"
                >
                    CV. Netzone Media
                </a>
            </p>

            <ul className="list-unstyled flex">
                <li className="mr-6">
                    <NavLink
                        className="text-gray-700 hover:text-gray-900 font-medium block text-sm"
                        to="/about"
                    >
                        About Us
                    </NavLink>
                </li>
                <li className="mr-6">
                    <a
                        className="text-gray-700 hover:text-gray-900 font-medium block text-sm"
                        target="_blank"
                        rel="noreferrer"
                        href="https://biartau.id"
                    >
                        Biartau.id
                    </a>
                </li>
                <li className="mr-6">
                    <NavLink
                        className="text-gray-700 hover:text-gray-900 font-medium block text-sm"
                        to="/contact"
                    >
                        Contact Us
                    </NavLink>
                </li>
                <li className="mr-6">
                    <NavLink
                        className="text-gray-700 hover:text-gray-900 font-medium block text-sm"
                        target="_blank"
                        rel="noreferrer"
                        to="/api/documentation"
                    >
                        Documentation API
                    </NavLink>
                </li>
            </ul>
        </footer>
    );
}
