import axios from "axios";

export async function getDistance({ origin, destination }) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const url = "https://maps.googleapis.com/maps/api/distancematrix/json";
  const { data } = await axios.get(url, { params: { origins: origin, destinations: destination, units: "metric", key } });
  return data;
}

export async function getAutocomplete({ input }) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
  const { data } = await axios.get(url, { params: { input, components: "country:ca", key } });
  return data;
}
