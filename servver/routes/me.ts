import { auth } from "../src/auth/auth.mjs";

export async function getSession(req: any) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return session;
}
