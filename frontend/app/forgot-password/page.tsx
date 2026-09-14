import { AuthCard } from "@/components/forms/auth-card";

export const metadata = {
  title: "Reset Password — Aurelia Motors",
  description: "Reset your Aurelia Motors account password securely.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-[80vh] place-items-center bg-[#f6f6f4] px-4 py-16">
      <AuthCard mode="forgot" />
    </div>
  );
}
