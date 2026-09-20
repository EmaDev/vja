// One-off admin utility: there is no UI for this yet, so custom claims are
// assigned by hand. Usage:
//   node scripts/set-cms-role.mjs user@vjaplantas.com admin
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Loaded by hand instead of via `node --env-file` — some machines on this
// team have a stray global `node_modules/node` package (v18.18.0) that
// shadows the real Node binary whenever npm resolves PATH, so `--env-file`
// (needs 20.6+) can't be relied on.
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!match) continue;
  const [, key, rawValue] = match;
  const value = rawValue.replace(/^"(.*)"$/, "$1");
  process.env[key] ??= value;
}

const [, , email, role] = process.argv;

if (!email || !["admin", "editor"].includes(role)) {
  console.error("Uso: node --env-file=.env.local scripts/set-cms-role.mjs <email> <admin|editor>");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(app);
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { role });
// Claims only take effect on the next ID token refresh: revoke so the
// current session is forced to mint one.
await auth.revokeRefreshTokens(user.uid);

console.log(`${email} -> role: ${role}`);
