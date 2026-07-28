import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up MediCore AI for your practice in a few minutes."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
