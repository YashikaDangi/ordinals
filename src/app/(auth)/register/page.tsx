"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User } from "lucide-react";
import WalletButton from "@/components/Wallet/WalletButton";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [userState, setUserState] = useState({
    email: "",
    password: "",
    name: "",
    password_confirmation: "",
  });
  //@ts-ignore
  const [errors, setError] = useState<registerErrorType>({});

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", userState);
      const response = res.data;
      if (response.status == 200) {
        router.push(`/login?message=${response.msg}`);
      } else if (response?.status == 400) {
        setError(response?.errors);
      } else {
        setError({});
      }
    } catch (err) {
      console.log("The error is", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0A0A0A]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Section - Image */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
          <img
            src="https://ordinals.com/content/64ef77ecd8f64ce7c293502ed806c8c936110f49f22dce46a75f8cc489073676i0"
            alt="Sign Up Background"
            className="object-cover h-full w-full transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Section - Form */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Create Account</h2>
              <p className="mt-2 text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-purple-500 hover:text-purple-400 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Wallet Button */}
            <div className="pt-2">
              <WalletButton />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400 bg-[#0A0A0A]">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={submitForm} className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Username Input */}
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                               transition-colors duration-200"
                      onChange={(e) =>
                        setUserState({ ...userState, name: e.target.value })
                      }
                    />
                  </div>
                  {errors?.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                               transition-colors duration-200"
                      onChange={(e) =>
                        setUserState({ ...userState, email: e.target.value })
                      }
                    />
                  </div>
                  {errors?.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                               transition-colors duration-200"
                      onChange={(e) =>
                        setUserState({ ...userState, password: e.target.value })
                      }
                    />
                  </div>
                  {errors?.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                               transition-colors duration-200"
                      onChange={(e) =>
                        setUserState({
                          ...userState,
                          password_confirmation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent
                         text-sm font-medium rounded-lg text-white bg-purple-500 hover:bg-purple-600
                         focus:outline-none transition-colors duration-200 disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Terms and Privacy */}
            <p className="text-center text-sm text-gray-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-purple-500 hover:text-purple-400">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-500 hover:text-purple-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}