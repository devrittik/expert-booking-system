import api from "./api";

export async function getExperts(params) {
  const response = await api.get("/experts", { params });
  return response.data;
}

export async function getExpertById(id) {
  const response = await api.get(`/experts/${id}`);
  return response.data;
}
