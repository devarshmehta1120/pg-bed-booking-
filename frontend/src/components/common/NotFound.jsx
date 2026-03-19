import { Link } from "@tanstack/react-router";

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="text-center max-w-lg">

        {/* 404 Title */}
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Page not found
        </h2>

        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">

          <Link
            to="/"
            className="px-6 py-3 bg-black text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Go Back
          </button>

        </div>

        {/* Small Help Text */}
        <p className="text-xs text-gray-400 mt-8">
          If you think this is a mistake, please contact support.
        </p>

      </div>
    </div>
  );
}

export default NotFound;