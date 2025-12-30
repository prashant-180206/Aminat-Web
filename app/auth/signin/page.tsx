"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual authentication
    console.log("Sign in with:", { email, password });
    setTimeout(() => setIsLoading(false), 1000);
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-txt py-4 z-10">Or</span>
            </div>
          </div>

          {/* Social Sign In (Coming Soon) */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-300"
            disabled
          >
            Continue with GitHub
          </Button>

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
          <Link href="/edit">
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
