import { AuthCard } from "@/components/forms/auth-card";

export const metadata = {
  title: "Sign In — Aurelia Motors",
  description: "Access your Aurelia account to view saved cars, preferences, and enquiries.",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-[80vh] place-items-center bg-[#f6f6f4] px-4 py-16">
      <AuthCard mode="login" />
    </div>
  );
}
