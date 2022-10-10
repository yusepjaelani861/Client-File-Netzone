export default function NotFound() {
    return (
        <>
            <div className="px-3 md:px-8 h-auto mt-20">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 xl:grid-cols-6">
                        <div className="xl:col-start-1 xl:col-end-5 px-4 mb-16">
                            <div className="bg-white border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        404 - Page not found
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <p className="my-4 text-gray-600 text-lg leading-relaxed">
                                        The page you are looking for does not exist.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}