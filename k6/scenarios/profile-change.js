import { getRequestParams } from "../helpers.js";
import { sleep, check } from "k6";
import http from "k6/http";

export default function profileChange({ accessToken1: accessToken }) {
  const profileRequest = () =>
    http.get(`${url}/user/me`, getRequestParams(accessToken));
  const changeProfileRequest = (body) =>
    http.patch(
      `${url}/user/me`,
      JSON.stringify(body),
      getRequestParams(accessToken)
    );
  const profileResponse = profileRequest();
  const profile = JSON.parse(profileResponse.body);

  const newAbout = (Math.random() * 1000).toString();
  const res = changeProfileRequest({
    updates: { about: newAbout },
  });

  check(res, { "After patching profile status 200": (r) => r && r.status == 200 });

  sleep(1);
}
