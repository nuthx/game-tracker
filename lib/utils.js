import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function tf(seconds) {
  return {
    minutes: Math.floor(seconds / 60),
    seconds: seconds % 60
  }
}
