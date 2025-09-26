import { createCookieSessionStorage } from "react-router";

let sessionSecret = process.env.SESSION_SECRET || "my-secret";

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "cart",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  },
});

export { getSession, commitSession, destroySession };
