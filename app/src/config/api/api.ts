import axios from "axios";
import { env } from "../env/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
