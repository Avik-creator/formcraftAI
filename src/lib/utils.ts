import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v7 as uuid } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = () => uuid()