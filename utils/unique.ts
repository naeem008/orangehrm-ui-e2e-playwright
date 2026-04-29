// utils/unique.ts

/**
 * Generates a unique string by appending a timestamp.
 * Example usage: unique('Employee') -> 'Employee_1708502345678'
 */
export function unique(prefix: string): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
}
