import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";

import React from "react";
"use client";
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form className="flex flex-col gap-4 w-80">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button>Login</Button>
        <Link href="/recover-password" className="text-blue-500">
          Recover Password
        </Link>
      </form>
    </div>
  );
}