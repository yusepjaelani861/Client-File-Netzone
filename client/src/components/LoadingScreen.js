export default function LoadingScreen() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-800 opacity-75 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-purple-500"></div>
      </div>
      <h2 className="text-center text-white text-xl font-semibold">
        Loading...
      </h2>
      <p className="w-1/3 text-center text-white">
        This may take a few seconds, please don't close this page.
      </p>
    </div>
  );
}
