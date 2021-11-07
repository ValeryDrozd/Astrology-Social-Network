import http from "k6/http";
import profileChange from "./scenarios/profile-change.js";
import getRecommendations from "./scenarios/get-recommendations.js";
import sendMessages from "./scenarios/send-messages.js";

exports.profileChange = profileChange;
exports.getRecommendations = getRecommendations;
exports.sendMessages = sendMessages;

export const options = {
  scenarios: {
    profileChange: {
      executor: "ramping-arrival-rate",
      startRate: 20,
      timeUnit: "1s",
      stages: [
        { target: 50, duration: "10s" },
        { target: 50, duration: "10s" },
        { target: 0, duration: "10s" },
      ],
      preAllocatedVUs: 20,
      maxVUs: 600,
      exec: "profileChange",
    },
    getRecommendations: {
      executor: "ramping-vus",
      stages: [
        { target: 200, duration: "10s" },
        { target: 200, duration: "10s" },
        { target: 0, duration: "10s" },
      ],
      exec: "getRecommendations",
    },
    sendMessages: {
      executor: "ramping-arrival-rate",
      startRate: 20,
      timeUnit: "1s",
      stages: [
        { target: 20, duration: "10s" },
        { target: 20, duration: "10s" },
        { target: 0, duration: "10s" },
      ],
      preAllocatedVUs: 100,
      maxVUs: 400,
      exec: "sendMessages",
    },
  },
  thresholds: {
    http_req_duration: ["p(90)<5000"],
  },
};

const { testUser1, testUser2, url } = JSON.parse(open("./params.json"));

export function setup() {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const payloads = [testUser1, testUser2].map((user) => JSON.stringify(user));
  const responses = payloads.map((payload) =>
    http.post(`${url}/auth/login`, payload, params)
  );
  const accessTokens = responses.map((res) => JSON.parse(res.body).accessToken);
  return { accessToken1: accessTokens[0], accessToken2: accessTokens[1] };
}
