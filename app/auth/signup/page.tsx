"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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
    // TODO: Implement actual authentication
    console.log("Sign up with:", formData);
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
