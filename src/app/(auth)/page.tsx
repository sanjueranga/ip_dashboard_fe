import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <>
      <Breadcrumb pageName="Sign In" />

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card xl:w-1/2 m-auto mt-28">
        <div className=" items-center">
            <div className="p-4 sm:p-12.5 xl:p-15 ">
              <Signin />
          </div>
        </div>
      </div>
    </>
  );
}
