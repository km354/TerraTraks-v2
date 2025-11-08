import Link from "next/link";

/**
 * Authentication Error Page
 * 
 * Displays authentication errors
 */
export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <main className="min-h-screen bg-offwhite flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
          <div className="mb-6">
            <svg
              className="h-16 w-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-forest mb-4">
            Authentication Error
          </h1>
          <p className="text-forest/70 mb-8">
            {error === "Configuration" && "There is a problem with the server configuration."}
            {error === "AccessDenied" && "You do not have permission to sign in."}
            {error === "Verification" && "The verification token has expired or has already been used."}
            {!error && "An unexpected error occurred during authentication."}
          </p>
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full px-6 py-3 border-2 border-transparent rounded-lg text-offwhite bg-forest hover:bg-forest-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-all font-semibold"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 border-2 border-sage/50 rounded-lg text-forest hover:bg-sage/10 transition-colors font-medium"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

