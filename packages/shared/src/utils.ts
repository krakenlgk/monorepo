// Shared utility functions

import type { ValidationError, CreateUserInput, UpdateUserInput } from './types';

/**
 * Date formatting utilities
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const formatDateForDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTimeForDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * ID generation utilities
 */
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Validation utilities
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateCreateUserInput = (input: CreateUserInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!input.email || !isValidEmail(input.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!input.firstName || !isValidName(input.firstName)) {
    errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
  }

  if (!input.lastName || !isValidName(input.lastName)) {
    errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
  }

  if (input.bio && input.bio.length > 500) {
    errors.push({ field: 'bio', message: 'Bio must be less than 500 characters' });
  }

  return errors;
};

export const validateUpdateUserInput = (input: UpdateUserInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (input.email !== undefined && (!input.email || !isValidEmail(input.email))) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (input.firstName !== undefined && (!input.firstName || !isValidName(input.firstName))) {
    errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
  }

  if (input.lastName !== undefined && (!input.lastName || !isValidName(input.lastName))) {
    errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
  }

  if (input.bio !== undefined && input.bio && input.bio.length > 500) {
    errors.push({ field: 'bio', message: 'Bio must be less than 500 characters' });
  }

  return errors;
};

/**
 * String utilities
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`;
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Object utilities
 */
export const omitUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  }
  return result;
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Array utilities
 */
export const sortByField = <T>(array: T[], field: keyof T, order: 'ASC' | 'DESC' = 'ASC'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal < bVal) return order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return order === 'ASC' ? 1 : -1;
    return 0;
  });
};

export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};
