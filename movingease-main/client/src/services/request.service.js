import api from "./api";

export function submitRequest(data) {
  return api.post("/requests", data);
}
