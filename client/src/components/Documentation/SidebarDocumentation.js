import { useState } from "react";
import { NavLink } from "react-router-dom";
import NavbarDocumentation from "./NavbarDocumentation";
import H6 from "@material-tailwind/react/Heading6";
import { Button, Icon } from "@material-tailwind/react";

export default function SidebarDocumentation() {
  const [showSidebar, setShowSidebar] = useState("left-0");

  return (
    <>
      <NavbarDocumentation
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <div
        className={`fixed z-50 top-0 overflow-y-auto flex-row flex-nowrap overflow-hidden w-64 h-screen bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${showSidebar}`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NavLink
                to="/docs"
                className="mt-2 text-center w-full inline-block"
              >
                <H6 color="gray">Docs Files Netzone</H6>
              </NavLink>
            </div>
            <button
              onClick={() =>
                setShowSidebar(showSidebar === "left-0" ? "-left-64" : "left-0")
              }
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 md:hidden"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-white text-center">
            <NavLink
              to="/docs/overview"
              className="block px-2 py-2 mb-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              activeClassName="bg-gray-100 text-gray-900"
            >
              Overview
            </NavLink>
            <NavLink
              to="/docs/uploads"
              className="block px-2 py-2 mb-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              activeClassName="bg-gray-100 text-gray-900"
            >
              Uploads
            </NavLink>
            <NavLink
              to="/docs/file"
              className="block px-2 py-2 text-sm mb-2 font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              activeClassName="bg-gray-100 text-gray-900"
            >
              File API
            </NavLink>
            {/* <div className="flex justify-center w-full text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 rounded-md">
                <span className="truncate">Dashboard</span>
            </div> */}
          </nav>
        </div>

        <ul className="flex-col min-w-full flex justify-center items-center list-none absolute bottom-0 py-2">
              <li className="rounded-lg mb-2 w-full px-2 py-2">
                <a 
                  href="/register"
                  target="_blank"
                  className="flex items-center gap-4 text-sm text-gray-700 hover:bg-gray-300 font-light px-2 py-2 rounded-lg"
                >
                  <Button
                    color="lightBlue"
                    buttonType="filled"
                    size="regular"
                    rounded={false}
                    block={false}
                    iconOnly={false}
                    ripple="light"
                    className="w-full"
                    >
                        Get Started
                    </Button>
                </a>
              </li>
        </ul>
      </div>
    </>
  );
}
