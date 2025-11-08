import { signIn } from "@/auth";

/**
 * Sign In Page
 * 
 * Allows users to sign in with Google OAuth
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";
  const error = params.error;

  return (
    <main className="min-h-screen bg-offwhite flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-2xl p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-forest mb-2">
              Welcome to TerraTraks
            </h1>
            <p className="text-forest/70">
              Sign in to start planning your trips
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                {error === "OAuthSignin" && "Error signing in with Google. Please try again."}
                {error === "OAuthCallback" && "Error processing OAuth callback. Please try again."}
                {error === "OAuthCreateAccount" && "Could not create account. Please try again."}
                {error === "EmailCreateAccount" && "Could not create account with email. Please use Google sign in."}
                {error === "Callback" && "Error in callback. Please try again."}
                {error === "OAuthAccountNotLinked" && "This account is already linked to another user."}
                {error === "EmailSignin" && "Error sending email. Please use Google sign in."}
                {error === "CredentialsSignin" && "Invalid credentials. Please use Google sign in."}
                {!["OAuthSignin", "OAuthCallback", "OAuthCreateAccount", "EmailCreateAccount", "Callback", "OAuthAccountNotLinked", "EmailSignin", "CredentialsSignin"].includes(error) && "An error occurred. Please try again."}
              </p>
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-4 border-2 border-transparent rounded-lg text-offwhite bg-forest hover:bg-forest-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-all shadow-md hover:shadow-lg font-semibold text-lg"
            >
              <svg
                className="h-6 w-6 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-sage/30">
            <p className="text-center text-sm text-forest/60">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

