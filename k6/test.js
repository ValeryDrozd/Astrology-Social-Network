import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  scenarios: {
    profileChange: {
      executor: "ramping-arrival-rate",
      startRate: 20,
      timeUnit: "1s",
      stages: [
        { target: 200, duration: "10s" },
        { target: 200, duration: "1m" },
        { target: 0, duration: "10s" },
      ],
      preAllocatedVUs: 20,
      maxVUs: 600,
      exec: "profileChange",
    },
    getRecommendations: {
      executor: "ramping-vus",
      stages: [
        { target: 500, duration: "20s" },
        { target: 500, duration: "1m" },
        { target: 0, duration: "20s" },
      ],
      exec: "getRecommendations",
    },
  },
  thresholds: {
    http_req_duration: ["p(99)<1500"],
  },
};
const { testUser1, url } = JSON.parse(open("./params.json"));

const { email, password, astrologicalToken } = testUser1;

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
const getRequestParams = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
}); 
export function profileChange(accessToken) {
  const profileRequest = () => http.get(`${url}/user/me`, getRequestParams(accessToken));
  const changeProfileRequest = (body) =>
    http.patch(`${url}/user/me`, JSON.stringify(body),  getRequestParams(accessToken));
  const profileResponse = profileRequest();
  const profile = JSON.parse(profileResponse.body);

  const newAbout = (Math.random() * 1000).toString();
  changeProfileRequest({
    updates: { about: newAbout },
  });

  // const newProfile = JSON.parse(profileRequest().body);

  // console.log(Old about: ${profile.about});
  // console.log(New about (from server): ${newProfile.about});
  // console.log(New about (generated before): ${newAbout});

  sleep(1);
}

export function getRecommendations(accessToken) {
  const recommendationsRequest = () => http.get(`${url}/user/recommendations`, getRequestParams(accessToken));
  const recommendations = recommendationsRequest()
  check(recommendations, { 'status 200': (r) => r && r.status == 200})
}
