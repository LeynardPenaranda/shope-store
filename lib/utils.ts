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

//Shorten the Uuid

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

//Format the date and time

export function formatDateandTime(dateString: Date) {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", //Abbreviated month name (e.g., "Oct" for October)
    year: "numeric", //Abbreviated year (e.g., 2025)
    day: "numeric", //Abbreviated day (e.g., 25)
    hour: "numeric",
    minute: "numeric",
    hour12: true, // use the 12-hour clock structure (true) or 24 hours just turn it to (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday (e.g., "Mon" for Monday)
    month: "short", // abbreviated month (e.g., "oct")
    year: "numeric", //Abbreviated year (e.g., 2025)
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '6')
    minute: "numeric", // numeric minute month (e.g., '30')
    hour12: true, // use the 12-hour clock structure (true) or 24 hours just turn it to (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-PH",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-PH",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-PH",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
}
