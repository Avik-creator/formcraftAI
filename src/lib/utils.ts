import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v7 as uuid } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = () => uuid()

export const pickFromObject = <T extends Record<string, unknown>>(obj: T, keys: string[]) => {
  const result: Record<string, unknown> = {};
  keys.forEach((key) => {
    if (obj[key]) result[key] = obj[key];
  });
  return result;
};

export const omitFromObject = <T extends Record<string, unknown>>(obj: T, keys: string[]) => {
  const result: Record<string, unknown> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (!keys.includes(key)) result[key] = value;
  });
  return result;
};

export const camelCaseToReadable = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};