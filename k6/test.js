import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 20, 
  duration: '30s',
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },
};
const { testUser1, url } = JSON.parse(
  open("./params.json")
);

const {email, password, astrologicalToken} = testUser1

export function setup() {
  const payload = JSON.stringify({ email, password, astrologicalToken });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = http.post(`${url}/auth/login`, payload, params);
  const { accessToken } = JSON.parse(response.body);
  return accessToken;
}

export default function (accessToken) {
  const requestParams = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  const profileRequest = () => http.get(`${url}/user/me`, requestParams);
  const changeProfileRequest = (body) =>
    http.patch(`${url}/user/me`, JSON.stringify(body), requestParams);
  const profileResponse = profileRequest();
  const profile = JSON.parse(profileResponse.body);

  const newAbout = (Math.random() * 1000).toString();
  changeProfileRequest({
    updates: { about: newAbout },
  });

  // const newProfile = JSON.parse(profileRequest().body);

  // console.log(`Old about: ${profile.about}`);
  // console.log(`New about (from server): ${newProfile.about}`);
  // console.log(`New about (generated before): ${newAbout}`);

  sleep(1);
}
