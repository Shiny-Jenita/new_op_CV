import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const withErrorHandling = <T extends (...args: unknown[]) => unknown>(
  fn: T
) => {
  return (...args: Parameters<T>): ReturnType<T> | null => {
    try {
      return fn(...args) as ReturnType<T>;
    } catch (error) {
      console.error("An error occurred:", error);
      return null;
    }
  };
};
