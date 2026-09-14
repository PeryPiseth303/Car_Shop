"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Gauge,
  ArrowRight,
  Lock,
  Mail,
  User,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/context/auth-context";
import { ADMIN_EMAIL } from "@/lib/constants";

interface AuthCardProps {
  mode: "login" | "register" | "forgot";
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { login, register, verifyOTP, resendOTP } = useAuth();

  // Form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification state
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [maskedEmail, setMaskedEmail] = useState("");

  // Status & Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // OTP Input refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Demo Account Quick Fill
  const fillDemoAccount = (demoEmail: string, demoPass: string, demoRole: "admin" | "user" = "user") => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSelectedRole(demoRole);
    if (mode === "register") {
      setFullName(demoRole === "admin" ? "Aurelia Administrator" : "Alex Morgan");
    }
    setErrorMessage(null);
  };

  // Step 1: Submit Credentials
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        setMaskedEmail(res.masked_email || email);
        setStep("otp");
        setResendTimer(60);
        setSuccessMessage("Verification code sent to your email! Please enter your 6-digit OTP.");
      } else if (mode === "register") {
        const res = await register(email, password, fullName, "user");
        setMaskedEmail(res.masked_email || email);
        setStep("otp");
        setResendTimer(60);
        setSuccessMessage("Account created! Verification code sent to your email.");
      } else {
        // Forgot password flow
        await resendOTP(email, "forgot");
        setMaskedEmail(email);
        setStep("otp");
        setResendTimer(60);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP Input changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // User pasted full code
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newCode = [...otpCode];
        for (let i = 0; i < 6; i++) {
          newCode[i] = pasted[i] || "";
        }
        setOtpCode(newCode);
        const nextIndex = Math.min(pasted.length, 5);
        inputRefs.current[nextIndex]?.focus();
        return;
      }
    }

    const digit = value.slice(-1).replace(/\D/g, "");
    const newCode = [...otpCode];
    newCode[index] = digit;
    setOtpCode(newCode);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && otpCode.join("").length === 6) {
      triggerVerify();
    }
  };

  const triggerVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otpCode.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const purpose = mode === "register" ? "register" : mode === "forgot" ? "forgot" : "login";
      const result = await verifyOTP(email, code, purpose);
      setSuccessMessage("Authentication successful! Redirecting...");

      setTimeout(() => {
        if (result.user.role === "admin" && result.user.email?.toLowerCase() === ADMIN_EMAIL) {
          router.push("/mgmt-portal-8x2");
        } else {
          router.push("/");
        }
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const purpose = mode === "register" ? "register" : "login";
      await resendOTP(email, purpose);
      setResendTimer(60);
      setSuccessMessage("A fresh verification code has been generated!");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="card w-full max-w-md p-8 shadow-xl md:p-10 transition-all duration-300">
      {/* Brand Icon & Eyebrow */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
        <Link href="/" className="inline-flex items-center gap-2 font-black tracking-tight">
          <span className="grid size-8.5 place-items-center rounded-xl bg-[#111214] text-white shadow-xs">
            <Gauge size={17} />
          </span>
          <span className="text-base font-black tracking-tighter text-neutral-900">
            AURELIA<span className="text-[#ef3f32]">.</span>
          </span>
        </Link>
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600">
          <ShieldCheck size={12} className="text-[#ef3f32]" />
          <span>OTP Protected</span>
        </span>
      </div>

      {/* STEP 1: FORM INPUTS */}
      {step === "form" && (
        <>
          <div className="mt-6">
            <h1 className="serif text-3xl font-normal text-neutral-900 md:text-3.5xl">
              {mode === "login"
                ? t("Welcome back.")
                : mode === "register"
                ? t("Join Aurelia.")
                : t("Reset your password.")}
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              {mode === "login"
                ? "Sign in with your email and password to receive a 2-step OTP verification code."
                : mode === "register"
                ? "Create an account and verify your email with a secure OTP code."
                : "Enter your email to receive a password reset verification code."}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleInitialSubmit} className="mt-5 space-y-4">
            {mode === "register" && (
              <>
                <label className="block">
                  <span className="label">{t("Full name")}</span>
                  <div className="relative">
                    <User
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      className="input !pl-10 text-xs"
                      placeholder="Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </label>
              </>
            )}

            <label className="block">
              <span className="label">{t("Email")}</span>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  className="input !pl-10 text-xs"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            {mode !== "forgot" && (
              <label className="block">
                <span className="label">{t("Password")}</span>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    className="input !pl-10 !pr-11 text-xs"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            )}

            {mode === "login" && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-neutral-500 transition hover:text-[#ef3f32]"
                >
                  {t("Forgot password?")}
                </Link>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark w-full py-3.5 text-xs font-bold disabled:opacity-50"
              >
                <span>
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "Continue with OTP"
                    : mode === "register"
                    ? "Register & Get OTP"
                    : "Send OTP Code"}
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </>
      )}

      {/* STEP 2: OTP VERIFICATION */}
      {step === "otp" && (
        <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition mb-3"
            >
              <ArrowLeft size={14} />
              <span>Back to credentials</span>
            </button>
            <h1 className="serif text-3xl font-normal text-neutral-900">
              Enter OTP Code
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
              We sent a 6-digit authentication code to{" "}
              <span className="font-bold text-neutral-900">{maskedEmail}</span>
            </p>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && !errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-100">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 6 Digit Inputs */}
          <div>
            <div className="flex justify-between gap-2 sm:gap-3 my-4">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="size-12 sm:size-13 rounded-xl border border-neutral-200 bg-neutral-50 text-center font-mono text-xl font-bold text-neutral-900 shadow-2xs transition focus:border-[#ef3f32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef3f32]/20"
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerVerify()}
            disabled={loading || otpCode.join("").length !== 6}
            className="btn btn-dark w-full py-3.5 text-xs font-bold disabled:opacity-50"
          >
            <span>
              {loading
                ? "Verifying..."
                : mode === "register"
                ? "Verify & Complete Registration"
                : mode === "forgot"
                ? "Verify Reset Code"
                : "Verify & Sign In"}
            </span>
            <CheckCircle2 size={15} />
          </button>

          {/* Resend OTP */}
          <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs">
            <span className="text-neutral-400">Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || loading}
              className={`font-bold transition flex items-center gap-1 ${
                resendTimer > 0
                  ? "text-neutral-400 cursor-not-allowed"
                  : "text-[#ef3f32] hover:underline"
              }`}
            >
              <RotateCcw size={12} />
              <span>
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend OTP"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      {step === "form" && (
        <>
          {mode !== "forgot" ? (
            <>
              <p className="mt-7 text-center text-xs text-neutral-500 border-t border-neutral-100 pt-5">
                {mode === "login" ? "New to Aurelia? " : "Already a member? "}
                <Link
                  className="font-bold text-[#111214] hover:text-[#ef3f32] hover:underline"
                  href={mode === "login" ? "/register" : "/login"}
                >
                  {mode === "login" ? t("Create account") : t("Sign in")}
                </Link>
              </p>
            </>
          ) : (
            <p className="mt-7 text-center text-xs text-neutral-500 border-t border-neutral-100 pt-5">
              Remembered your password?{" "}
              <Link
                className="font-bold text-[#111214] hover:text-[#ef3f32] hover:underline"
                href="/login"
              >
                {t("Sign in")}
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
