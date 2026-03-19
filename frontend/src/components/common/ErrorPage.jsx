import { Link } from "@tanstack/react-router";

function ErrorPage({ error }) {
  const errorId = Math.random().toString(36).substring(2, 10);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center">

        {/* Icon */}
        <div className="text-6xl mb-4">⚠️</div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>

        {/* Error Message */}
        {error?.message && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-6">
            {error.message}
          </div>
        )}

        {/* Error ID */}
        <p className="text-xs text-gray-400 mb-6">
          Error ID: <span className="font-mono">{errorId}</span>
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">

          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-black text-white rounded-lg hover:opacity-90 transition"
          >
            Retry
          </button>

          <Link
            to="/"
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Go Home
          </Link>

        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 mt-8">
          Need help? Contact <span className="font-medium">support@example.com</span>
        </p>

      </div>
    </div>
  );
}

export default ErrorPage;