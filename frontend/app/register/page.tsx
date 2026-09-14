import { AuthCard } from "@/components/forms/auth-card";

export const metadata = {
  title: "Create Account — Aurelia Motors",
  description: "Join Aurelia Motors to explore private listings and personalized automotive services.",
};

export default function RegisterPage() {
  return (
    <div className="grid min-h-[80vh] place-items-center bg-[#f6f6f4] px-4 py-16">
      <AuthCard mode="register" />
    </div>
  );
}
