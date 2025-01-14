"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
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

  const submitForm = async () => {
    setLoading(true);
    console.log("The payload is", userState);
    axios
      .post("/api/auth/register", userState)
      .then((res) => {
        setLoading(false);
        console.log("The response is", res.data);
        const response = res.data;
        if (response.status == 200) {
          router.push(`/login?message=${response.msg}`);
        } else if (response?.status == 400) {
          setError(response?.errors);
        } else {
          setError({});
        }
      })
      .catch((err) => console.log("The error is", err));
  };

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Section */}
        <div className="">
          <img
            src="https://ordinals.com/content/64ef77ecd8f64ce7c293502ed806c8c936110f49f22dce46a75f8cc489073676i0"
            alt="Illustration"
            className="max-w-full h-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Sign in
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?
                <a
                  href="/login"
                  className="ml-1 font-semibold text-blue-600 hover:underline"
                >
                  Log In
                </a>
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4">
              <WalletButton />
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Sign-in Form */}
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Username"
                  onChange={(e) =>
                    setUserState({ ...userState, name: e.target.value })
                  }
                />
                <span className="text-red-500 font-bold">{errors?.name}</span>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="tam@ui8.net"
                  onChange={(e) =>
                    setUserState({ ...userState, email: e.target.value })
                  }
                />
                <span className="text-red-500 font-bold">{errors?.email}</span>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="********"
                  onChange={(e) =>
                    setUserState({ ...userState, password: e.target.value })
                  }
                />
                <span className="text-red-500 font-bold">
                  {errors?.password}
                </span>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="********"
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center rounded-md !bg-blue-600 py-2 px-4 text-sm font-medium text-white !hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={submitForm}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    // <section>
    //   <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
    //     <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
    //       <div className="absolute inset-0">
    //         <img
    //           className="h-full w-full  object-cover object-top"
    //           src="https://img.freepik.com/premium-photo/stock-market-forex-trading-graph-graphic-concept_73426-106.jpg?w=1480"
    //           alt=""
    //         />
    //       </div>
    //       <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
    //       <div className="relative">
    //         <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">

    //           {/* <h2 className="text-white text-xl font-semibold mt-10">
    //             Production label Authentication with validations
    //           </h2> */}
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
    //       <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
    //         <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
    //           Sign up
    //         </h2>
    //         <p className="mt-2 text-base text-gray-600">
    //           Already have an account?
    //           <Link
    //             href="/login"
    //             title=""
    //             className="font-medium text-black transition-all duration-200 hover:underline ml-2"
    //           >
    //             Log In
    //           </Link>
    //         </p>
    //         <form action="#" method="POST" className="mt-8">
    //           <div className="space-y-5">
    //             <div>
    //               <label
    //                 htmlFor="name"
    //                 className="text-base font-medium text-gray-900"
    //               >
    //                 Full Name
    //               </label>
    //               <div className="mt-2">
    //                 <input
    //                   className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    //                   type="text"
    //                   placeholder="Full Name"
    //                   id="name"
    // onChange={(e) =>
    //   setUserState({ ...userState, name: e.target.value })
    // }
    //                 ></input>
    // <span className="text-red-500 font-bold">
    //   {errors?.name}
    // </span>
    //               </div>
    //             </div>
    //             <div>
    //               <label
    //                 htmlFor="email"
    //                 className="text-base font-medium text-gray-900"
    //               >
    //                 Email address
    //               </label>
    //               <div className="mt-2">
    //                 <input
    //                   className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    //                   type="email"
    //                   placeholder="Email"
    //                   id="email"
    // onChange={(e) =>
    //   setUserState({ ...userState, email: e.target.value })
    // }
    //                 ></input>
    // <span className="text-red-500 font-bold">
    //   {errors?.email}
    // </span>
    //               </div>
    //             </div>
    //             <div>
    //               <div className="flex items-center justify-between">
    //                 <label
    //                   htmlFor="password"
    //                   className="text-base font-medium text-gray-900"
    //                 >
    //                   Password
    //                 </label>
    //               </div>
    //               <div className="mt-2">
    //                 <input
    //                   className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    //                   type="password"
    //                   placeholder="Password"
    //                   id="password"
    // onChange={(e) =>
    //   setUserState({ ...userState, password: e.target.value })
    // }
    //                 ></input>
    // <span className="text-red-500 font-bold">
    //   {errors?.password}
    // </span>
    //               </div>
    //             </div>
    //             <div>
    //               <div className="flex items-center justify-between">
    //                 <label
    //                   htmlFor="password"
    //                   className="text-base font-medium text-gray-900"
    //                 >
    //                   Confirm Password
    //                 </label>
    //               </div>
    //               <div className="mt-2">
    //                 <input
    //                   className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    //                   type="password"
    //                   placeholder="Confirm Password"
    //                   id="password_confirmation"
    // onChange={(e) =>
    //   setUserState({
    //     ...userState,
    //     password_confirmation: e.target.value,
    //   })
    // }
    //                 ></input>
    //               </div>
    //             </div>
    //             <div>
    //               <button
    //                 type="button"
    //                 className={`inline-flex w-full items-center justify-center rounded-md  px-3.5 py-2.5 font-semibold leading-7 text-black hover:bg-black/80 ${
    //                   loading ? "bg-gray-700" : "bg-black"
    //                 }`}
    // onClick={submitForm}
    // disabled={loading}
    //               >
    //                 {loading ? "Processing..." : "Create Account"}
    //               </button>
    //             </div>
    //           </div>
    //         </form>
    //         <div className="space-y-3 flex items-center justify-center">
    //         <WalletButton />
    //         </div>

    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}
