import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert prisma object into regular js object

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

export function formatError(error: unknown): string {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
  }

  // Handle plain string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle native JS Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle API-style errors or unknown objects
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return "An unknown error occurred.";
    }
  }

  // Fallback
  return "Something went wrong.";
}

//Round number to 2 decimal
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}
