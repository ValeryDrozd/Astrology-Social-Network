import http from "k6/http";
import { sleep, check } from "k6";
import { profileRequest, login } from "../helpers.js";
import { testUser1, url } from "../env.js";
export default function refreshTokens() {
  const astrologicalToken = (Math.random() + 1).toString(36).substring(2);
  const loginRes = login(
    JSON.stringify({
      email: testUser1.email,
      password: testUser1.password,
      astrologicalToken,
    })
  );
  const refreshToken = loginRes.cookies.refreshToken[0].value;

  const params = {
    headers: {
      cookies: `refreshToken=${refreshToken}`,
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({
    astrologicalToken,
  });

  const getRefreshedToken = (body, params) =>
    http.post(`${url}/auth/refresh-tokens`, body, params);

  const res = getRefreshedToken(body, params);
  const { accessToken } = JSON.parse(res.body);
  const profile = profileRequest(accessToken);

  check(res, {
    "After refreshing tokens status 201": (r) => r && r.status == 201,
  });
  check(profile, {
    "After refreshing tokens get profile status 200": (r) =>
      r && r.status == 200,
  });

  sleep(1);
}
