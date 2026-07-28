"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (isSignup && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = isSignup
        ? await signup({ full_name: fullName, email, password })
        : await login({ email, password });

      // Demo only — replace with real session/JWT storage once the
      // backend auth endpoints exist.
      window.localStorage.setItem("medicore_demo_user", JSON.stringify(result));
      router.push("/admin");
    } catch (err) {
      setError(isSignup ? "Could not create account. Please try again." : "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {isSignup && (
        <Input
          id="fullName"
          label="Full name"
          type="text"
          placeholder="Dr. Amara Lee"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      )}

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@yourclinic.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />

      {isSignup && (
        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />
      )}

      {error && (
        <p className="rounded-lg bg-clay/10 px-4 py-2 text-sm text-clay">{error}</p>
      )}

      <Button type="submit" disabled={isLoading} className="mt-2 w-full">
        {isLoading
          ? isSignup
            ? "Creating account…"
            : "Signing in…"
          : isSignup
            ? "Create account"
            : "Sign in"}
      </Button>
    </form>
  );
}
