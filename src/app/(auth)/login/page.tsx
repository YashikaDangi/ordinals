"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import Toast from "@/components/Toast";
import WalletButton from "@/components/Wallet/WalletButton";

export default function SignInOne() {
  const searchParam = useSearchParams();

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  //@ts-ignore
  const [errors, setError] = useState<LoginErrorType>();

  useEffect(() => {
    console.log("The query is", searchParam.get("error"));
  }, []);

  //   * Submit the data
  const submitForm = async () => {
    setLoading(true);
    axios
      .post("/api/auth/login", authData)
      .then((res) => {
        setLoading(false);
        const response = res.data;
        console.log("The response is ", response);
        if (response.status == 200) {
          console.log("The user signed in", response);
          signIn("credentials", {
            email: authData.email,
            password: authData.password,
            callbackUrl: "/",
            redirect: true,
          });
          console.log("credentials got...");
        } else if (response.status == 400) {
          setError(response?.errors);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error is", err);
      });
  };

  return (
    <section>
      <Toast />
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen bg-gray-50 ">
        {/* Left Section */}
        <div className="">
          <img
            src="https://ordinals.com/content/64ef77ecd8f64ce7c293502ed806c8c936110f49f22dce46a75f8cc489073676i0"
            alt="Illustration"
            className="max-w-full h-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-6 py-10 bg-white">
          <div className="w-full max-w-md">
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-500 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Log in</h2>
            <p className="mt-2 text-sm text-gray-500">
              Log in with wallet
            </p>

            {/* Third-Party Sign-In */}
            <div className="mt-6 flex space-x-4">
              <WalletButton/>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <p className="mx-4 text-sm text-gray-500">Or continue with</p>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Email Sign-In Form */}
            <form action="#" method="POST" className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  // id="email"
                  placeholder="Email"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  onChange={(e) =>
                    setAuthData({ ...authData, email: e.target.value })
                  }
                />
                <span className="text-red-500 text-sm">{errors?.email}</span>
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
                  // id="password"
                  placeholder="Password"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  onChange={(e) =>
                    setAuthData({ ...authData, password: e.target.value })
                  }
                />
                <span className="text-red-500 text-sm">{errors?.password}</span>
              </div>

              <button
                type="button"
                onClick={submitForm}
                className="mt-4 w-full rounded-md !bg-blue-500 px-4 py-2 text-white font-semibold !hover:bg-blue-600"
              >
                {loading ? "Processing..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    // <section>
    //   <Toast />
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
    //           {/* <h3 className="text-4xl font-bold text-white">
    //             Next js Authentication process
    //           </h3> */}
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
    //       <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
    //         <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
    //           Login
    //         </h2>
    //         <p className="mt-2 text-base text-gray-600">
    //           Don't have an account?
    //           <Link
    //             href="/register"
    //             title=""
    //             className="font-medium text-black transition-all duration-200 hover:underline ml-2"
    //           >
    //             Sign Up
    //           </Link>
    //         </p>
    //         <form action="#" method="POST" className="mt-8">
    //           <div className="space-y-5">
    //             <div>
    //               <label
    //                 htmlFor=""
    //                 className="text-base font-medium text-gray-900"
    //               >
    //                 Email address
    //               </label>
    //               <div className="mt-2">
    //                 <input
    //                   className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    //                   type="email"
    //                   placeholder="Email"
    //                   onChange={(e) =>
    //                     setAuthData({ ...authData, email: e.target.value })
    //                   }
    //                 ></input>
    //                 <span className="text-red-500 font-bold">
    //                   {errors?.email}
    //                 </span>
    //               </div>
    //             </div>
    //             <div>
    //               <div className="flex items-center justify-between">
    //                 <label
    //                   htmlFor=""
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
    //                   onChange={(e) =>
    //                     setAuthData({ ...authData, password: e.target.value })
    //                   }
    //                 ></input>
    //                 <span className="text-red-500 font-bold">
    //                   {errors?.password}
    //                 </span>
    //               </div>
    //               <div className="text-right">
    //                 <Link href="/forgot-password">Forgot password ?</Link>
    //               </div>
    //             </div>
    //             <div>
    //               <button
    //                 type="button"
    //                 className={`inline-flex w-full items-center justify-center rounded-md  px-3.5 py-2.5 font-semibold leading-7 text-black hover:bg-black/80  ${
    //                   loading ? "bg-gray-900" : "bg-black"
    //                 }`}
    //                 onClick={submitForm}
    //               >
    //                 {loading ? "Processing.." : "Login"}
    //               </button>
    //             </div>
    //           </div>
    //         </form>
    //         <p className="text-center my-3">-- OR --</p>
    //         <div className="space-y-3 flex items-center justify-center">
    //           <WalletButton />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}
