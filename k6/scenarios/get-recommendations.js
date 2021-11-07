import http from "k6/http";
import { check } from "k6";
import { getRequestParams } from "../helpers.js";
export default function getRecommendations({ accessToken1: accessToken }) {
  const recommendationsRequest = () =>
    http.get(`${url}/user/recommendations`, getRequestParams(accessToken));
  const recommendations = recommendationsRequest();
  check(recommendations, { "After get recommendations status 200": (r) => r && r.status == 200 });
}
