"use server";

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateUserSchema,
} from "../validator";
import { auth, signIn, signOut } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { ZodError, z } from "zod";
import { Address, ShippingAddress } from "@/types";
import { convertToPlainObject, formatError } from "../utils";
import { getMyCart } from "./cart.action";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@/lib/generated/prisma";

//Sign In with Google

// export async function signInWithGoogle() {
//   await signIn("google", { callbackUrl: "/" });
// }

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

    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message || "Validation failed",
      };
    }

    return {
      success: false,
      message: "Invalid Email or Password",
    };
  }
}

//Sign user out
export async function signOutUser() {
  const currentCart = await getMyCart();
  if (currentCart) {
    await prisma.cart.delete({ where: { id: currentCart?.id } });
  }
  await signOut();
}

//Sign Up User

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const findExistingEmail = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (findExistingEmail) {
      return {
        success: false,
        message: "Sorry Email already Exist, Please use new email",
      };
    }

    const plainPassword = user.password;

    user.password = hashSync(user.password, 12);

    await prisma.user.create({
      data: { name: user.name, email: user.email, password: user.password },
    });

    //Sign in automatically after sign up

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return {
      success: true,
      message: "User registered successfully!",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    // ✅ Handle Zod validation errors
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message || "Validation failed",
      };
    }

    return {
      success: false,
      message: "User failed to register",
    };
  }
}

//Get user by ID

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return convertToPlainObject(user);
}

// Update users address

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currenUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currenUser) throw new Error("User Not Found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currenUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update user payment method

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not Found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User payment updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update the user profile

export async function updateProfile(user: {
  name: string;
  email: string;
  address: Record<string, string>;
}) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not authenticated");
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
        address: user.address,
        email: user.email,
      },
    });

    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getUserAddress(userId: string): Promise<Address | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user || !user.address) return null;

  return user.address as Address;
}

// Get all the users

export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update a user

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: user.name, role: user.role },
    });

    revalidatePath(`/admin/users`);
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
