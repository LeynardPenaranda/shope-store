"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signInWithCredentials, signUpUser } from "@/lib/actions/user.action";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import SpinnerMiniv1 from "@/components/shared/SpinnerMiniv1";

import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import GoogleSignIn from "../signIn/SignInGoogle";

const SignUpForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [isEyeOpenConfirmPassword, setIsEyeOpenConfirmPassword] =
    useState(false);
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <div className="flex items-center justify-center gap-2">
            <span>Submitting...</span> <SpinnerMiniv1 />
          </div>
        ) : (
          <span>Sign Up</span>
        )}
      </Button>
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              required
              autoComplete="email"
              className="ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
          <div className="relative">
            <Label htmlFor="email">Password</Label>
            <Input
              id="password"
              name="password"
              type={isEyeOpen ? "text" : "password"}
              required
              autoComplete="password"
              className="pr-8  ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
            <span
              className="absolute top-5 right-2 cursor-pointer"
              onClick={() => setIsEyeOpen((e) => !e)}
            >
              {isEyeOpen ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </span>
          </div>

          <div className="relative">
            <Label htmlFor="email">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={isEyeOpenConfirmPassword ? "text" : "password"}
              required
              autoComplete="confirmPassword"
              className="pr-8  ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
            <span
              className="absolute top-5 right-2 cursor-pointer"
              onClick={() => setIsEyeOpenConfirmPassword((c) => !c)}
            >
              {isEyeOpenConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </span>
          </div>
          <SignUpButton />
          {data && !data.success && (
            <div className="text-center text-destructive bg-red-200 rounded-2xl px-5 sm:px-0">
              {data.message}
            </div>
          )}
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?
            <Link href="/signIn" target="_self" className="link">
              <span className="underline"> Sign In</span>
            </Link>
          </div>
        </div>
      </form>
      <div className="relative w-full flex items-center justify-center">
        <p
          className={`absolute ${
            theme === "light" ? `bg-white` : `bg-card`
          } px-1.5`}
        >
          Or
        </p>
        <div className="border-b border-gray-400 w-full"></div>
      </div>
      <GoogleSignIn />
    </>
  );
};

export default SignUpForm;
