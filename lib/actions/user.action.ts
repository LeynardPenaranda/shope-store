"use server";

import { signInFormSchema } from "../validator";
import { signIn, signOut } from "@/auth";

import { isRedirectError } from "next/dist/client/components/redirect-error";

//Sign In with Google

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

//Sign in the user with credentials

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return {
      success: true,
      message: "Sign In successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid Email or Password",
    };
  }
}

//Sign user out
export async function signOutUser() {
  await signOut();
}
