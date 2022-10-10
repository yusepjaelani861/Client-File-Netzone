export default function Welcome() {
    return (
        <>
            <div className="px-3 md:px-8 h-auto -mt-24 pt-32">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 px-4 mb-8" id="da">
                        <div className="bg-white border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    Welcome to the Files Netzone
                                </h3>
                            </div>
                            <div className="relative p-6 flex-auto">
                                <p className="my-4 text-gray-600 text-lg leading-relaxed">  
                                    This is the dashboard of the Files Netzone. Here you can manage your files and API keys.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}