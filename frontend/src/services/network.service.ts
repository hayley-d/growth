import axios from "axios";

import { createNetworkErrorHandlerInterceptor } from "@/services/utils";

const networkService = axios.create({
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  responseType: "json",
});

createNetworkErrorHandlerInterceptor(networkService);

export { networkService };
