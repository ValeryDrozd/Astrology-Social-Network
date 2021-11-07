import http from "k6/http";


export const options = {
  vus: 20, 
  duration: '30s',
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },
};

const { testUser1, testUser2, url } = JSON.parse(open("./params.json"));

export function setup() {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const payload1 = JSON.stringify(testUser1);
  const payload2 = JSON.stringify(testUser2);

  const response1 = http.post(`${url}/auth/login`, payload1, params);
  const response2 = http.post(`${url}/auth/login`, payload2, params);

  const { accessToken: accessToken1 } = JSON.parse(response1.body);
  const { accessToken: accessToken2 } = JSON.parse(response2.body);
  return { accessToken1, accessToken2 };
}

export default function ({ accessToken1, accessToken2 }) {
  const getWsParams = (accessToken) => ({
    headers: {
      cookie: `accessToken=${accessToken}`,
    },
  });

  const getRequestParams = (accessToken) => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const profileRequest = (accessToken) =>
    http.get(`${url}/user/me`, getRequestParams(accessToken));
  // const profileResponse1 = profileRequest(accessToken1);
  const profile1 = JSON.parse(profileRequest(accessToken1).body);
  const profile2 = JSON.parse(profileRequest(accessToken2).body);
  
}
