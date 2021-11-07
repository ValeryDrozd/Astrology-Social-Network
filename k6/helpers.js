import http from "k6/http";
import { url } from "./env.js";

export const getRequestParams = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});

export const login = (payload) =>
  http.post(`${url}/auth/login`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const profileRequest = (accessToken) =>
  http.get(`${url}/user/me`, getRequestParams(accessToken));

export const changeProfileRequest = (body, accessToken) =>
  http.patch(
    `${url}/user/me`,
    JSON.stringify(body),
    getRequestParams(accessToken)
  );

export const recommendationsRequest = (accessToken) =>
  http.get(`${url}/user/recommendations`, getRequestParams(accessToken));
