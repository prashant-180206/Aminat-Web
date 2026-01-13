"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Github } from "lucide-react";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = result.error || "Invalid email or password";
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (result?.ok) {
        toast.success("Signed in successfully!");
        router.push("/scene/edit");
      }
    } catch (err) {
      const errorMessage = "An error occurred during sign in";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await signIn("github", { callbackUrl: "/scene" });
      console.log("Redirecting to GitHub for sign in");
    } catch (err) {
      toast.error("Failed to sign in with GitHub");
      console.error(err);
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
            <h1 className="text-2xl font-bold text-txt mb-2">Welcome Back</h1>
            <p className="text-txt-sec">
              Sign in to your account to continue creating
            </p>
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
              onClick={handleGithubSignIn}
              disabled={isGithubLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white"
            >
              <Github className="w-4 h-4 mr-2" />
              {isGithubLoading ? "Signing in..." : "Sign in with GitHub"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-txt py-4 z-10">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-txt-sec">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-txt-sec">
            {"Don't have an account?"}{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </Card>

        {/* Demo Link */}
        <div className="mt-8 text-center">
          <p className="text-txt-sec mb-4">Want to try it first?</p>
          <Link href="/scene/edit">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              Go to the Editor (Demo Mode)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
