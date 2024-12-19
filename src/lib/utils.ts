import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidPlateNumber(plateNumber: string): boolean {
  // Basic Indonesian license plate validation
  const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/;
  return plateRegex.test(plateNumber.toUpperCase());
}

export function getLastDigit(plateNumber: string): number {
  const match = plateNumber.match(/\d+/);
  if (!match) return -1;
  return parseInt(match[0].slice(-1));
}
