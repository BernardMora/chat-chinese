"use client"; // Mark as a Client Component

import {
  GoogleOAuthProvider,
  GoogleLogin,
  GoogleCredentialResponse,
} from "@react-oauth/google";

type GoogleLoginButtonProps = {
  onSuccess: (credentialResponse: GoogleCredentialResponse) => void;
  onError: () => void;
};

export function GoogleLoginButton({
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  return (
    <GoogleOAuthProvider clientId="587476427757-eelbn28rj7nfd6nr6ol56819h4a4gcnf.apps.googleusercontent.com">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </GoogleOAuthProvider>
  );
}
