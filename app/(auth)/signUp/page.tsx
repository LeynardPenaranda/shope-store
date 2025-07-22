import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Metadata } from "next";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInLogo from "../signIn/SignInLogo";
import SignUpForm from "./signUpForm";

export const metadata: Metadata = {
  title: "SignUp",
};

const SignUpPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const session = await auth();

  const { callbackUrl } = await props.searchParams;

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border border-gray-300">
        <CardHeader className="space-y-4">
          <SignInLogo />
          <CardTitle className="text-center">
            Sign up to Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your Information below to sign up
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
