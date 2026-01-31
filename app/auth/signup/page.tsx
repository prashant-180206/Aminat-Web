"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Github, GraduationCap, BookOpen } from "lucide-react";
import { toast } from "sonner";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "teacher",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create account");
        toast.error(data.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully! Signing in...");

      // Sign in after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/project");
      } else {
        // Account created but sign in failed, redirect to sign in page
        router.push("/auth/signin");
      }
    } catch {
      setError("An error occurred during sign up");
      toast.error("An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setIsGithubLoading(true);
    try {
      await signIn("github");
    } catch {
      toast.error("Failed to sign up with GitHub");

      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-950 to-purple-950 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 mt-10"
        >
          <Sparkles className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Animat
          </span>
        </Link>

        {/* Card */}
        <Card className="p-8 border border-bg-dark shadow-lg">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-txt mb-2">
              Create Your Account
            </h1>
            <p className="text-txt-sec">Start creating animations today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={handleGithubSignUp}
              disabled={isGithubLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white"
            >
              <Github className="w-4 h-4 mr-2" />
              {isGithubLoading ? "Signing up..." : "Sign up with GitHub"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-txt py-4 z-10">
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="name" className="text-txt-sec">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="mt-2"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <Label className="text-txt-sec mb-3 block">I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "student" }))
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    formData.role === "student"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <GraduationCap
                    className={`w-6 h-6 ${
                      formData.role === "student"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      formData.role === "student"
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    Student
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    Learn and practice math
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "teacher" }))
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    formData.role === "teacher"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <BookOpen
                    className={`w-6 h-6 ${
                      formData.role === "teacher"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      formData.role === "teacher"
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    Teacher
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    Create and manage content
                  </span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-txt-sec">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-2"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-txt-sec">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="mt-2"
                required
              />
              <p className="text-xs text-txt-sec mt-1">At least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-txt-sec">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-2"
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: checked as boolean,
                  }))
                }
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-txt-sec cursor-pointer"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-txt-sec">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </Card>

        {/* Demo Link */}
        <div className="mt-8 text-center">
          <p className="text-txt-sec mb-4">
            Or just explore without signing up
          </p>
          <Link href="/edit">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              Try the Editor (Demo Mode)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
