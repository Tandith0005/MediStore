import { envVars } from "@/config/envVars";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${envVars.AUTH_URL}/api/auth`, 
  plugins: [
    inferAdditionalFields({
      user: { role: { type: "string" } },
    }),
  ],
});