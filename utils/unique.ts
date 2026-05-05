export function unique(prefix: string): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
}
