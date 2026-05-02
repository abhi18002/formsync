import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn =(...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}


export function toCapitalCase(str: string): string {
  return str
      .toLowerCase() // Convert the entire string to lower case
      .split('.') // Split the string by dots
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together without spaces
}


