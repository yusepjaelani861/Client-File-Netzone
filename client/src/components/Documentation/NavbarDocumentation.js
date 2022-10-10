import { useLocation } from "react-router-dom";

export default function NavbarDocumentation({ showSidebar, setShowSidebar }) {
  const location = useLocation().pathname;
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <button
                onClick={() =>
                  setShowSidebar(
                    showSidebar === "left-0" ? "-left-64" : "left-0"
                  )
                }
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
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
            <div className="flex justify-center items-center pl-24">
                <h1>
                {location === '/docs' ? "DOCUMENTATION" : `DOCUMENTATION - ${location.replace('/docs/', '').toUpperCase()}`}

                </h1>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
