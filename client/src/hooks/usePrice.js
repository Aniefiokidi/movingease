import { useMemo } from "react";
import { calculateLivePrice } from "../utils/pricingEngine";

export default function usePrice(data) {
  return useMemo(() => calculateLivePrice(data), [data]);
}
