import { check } from "k6";
import { recommendationsRequest } from "../helpers.js";
export default function getRecommendations({ accessToken1: accessToken }) {
  const recommendations = recommendationsRequest(accessToken);
  check(recommendations, {
    "After get recommendations status 200": (r) => r && r.status == 200,
  });
}
