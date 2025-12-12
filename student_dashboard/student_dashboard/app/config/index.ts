function required(key: string): string {
  // Only run this check on server
  if (typeof window === "undefined") {
    const value = process.env[key];
    if (!value) {
      throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
  }

  // CLIENT SIDE → always return injected NEXT_PUBLIC value
  return (process.env[key] as string) || "";
}

export const ENV = {
  BASE_URL: required("NEXT_PUBLIC_BASE_URL"),


};
