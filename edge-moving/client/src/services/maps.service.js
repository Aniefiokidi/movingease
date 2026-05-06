import api from "./api";

export const getDistance = (payload) => api.post("/maps/distance", payload);
export const getAutocomplete = (payload) => api.post("/maps/autocomplete", payload);
