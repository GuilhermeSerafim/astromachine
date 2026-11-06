type DemoAccount = { email: string; password: string };
type DemoSeedCredentials = { admin: DemoAccount; client: DemoAccount };

// Server-only configuration. Never import this module into the mobile bundle.
export function readDemoSeedCredentials(
  env: Record<string, string | undefined> = process.env,
): DemoSeedCredentials | null {
  if (env.ENABLE_DEMO_SEED !== "true") return null;
  if (env.NODE_ENV !== "development") {
    throw new Error("Demo seeding is permitted only in an explicit development environment.");
  }
  const required = (key: string): string => {
    const value = env[key];
    if (!value || !value.trim()) {
      throw new Error(`Missing server-only configuration: ${key}`);
    }
    return value;
  };
  const credentials: DemoSeedCredentials = {
    admin: {
      email: required("DEMO_ADMIN_EMAIL").trim(),
      password: required("DEMO_ADMIN_PASSWORD"),
    },
    client: {
      email: required("DEMO_CLIENT_EMAIL").trim(),
      password: required("DEMO_CLIENT_PASSWORD"),
    },
  };
  // Trim matches this seed's existing input handling. Case-insensitive rejection
  // is a conservative seed-only constraint; it does not change login/storage.
  if (credentials.admin.email.toLowerCase() === credentials.client.email.toLowerCase()) {
    throw new Error("Demo accounts must use distinct email addresses.");
  }
  return credentials;
}
