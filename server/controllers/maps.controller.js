import { getAutocomplete, getDistance } from "../services/maps.service.js";
import { apiResponse } from "../utils/response.js";

export async function distanceProxy(req, res, next) {
  try {
    const data = await getDistance(req.body);
    return apiResponse(res, 200, true, data, "Distance result");
  } catch (e) { next(e); }
}

export async function autocompleteProxy(req, res, next) {
  try {
    const data = await getAutocomplete(req.body);
    return apiResponse(res, 200, true, data, "Autocomplete result");
  } catch (e) { next(e); }
}
