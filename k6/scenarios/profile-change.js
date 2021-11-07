import { profileRequest, changeProfileRequest } from "../helpers.js";
import { sleep, check } from "k6";
import http from "k6/http";

export default function profileChange({ accessToken1: accessToken }) {
 
  const profileResponse = profileRequest(accessToken);
  const profile = JSON.parse(profileResponse.body);

  const newAbout = (Math.random() * 1000).toString();
  const res = changeProfileRequest({
    updates: { about: newAbout },
  }, accessToken);

  check(res, { "After patching profile status 200": (r) => r && r.status == 200 });

  sleep(1);
}
