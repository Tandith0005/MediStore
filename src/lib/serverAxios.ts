import axios from "axios";
import { cookies } from "next/headers";
import { envVars } from "@/config/envVars";

export const serverApi = async () => {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: envVars.API_URL,
    headers: {
      cookie: cookieStore.toString(),
      origin: envVars.APP_URL,
    },
    withCredentials: true,
  });
};