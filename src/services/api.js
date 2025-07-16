import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.15.13:5000", // Backend Flask
});

export const login = (data) => API.post("/login", data);

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Corrija a exportação aqui:
export default fetchWithAuth;
