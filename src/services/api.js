import axios from "axios";

const apiUrl = "https://sistema-vivaz-backend.onrender.com";

const API = axios.create({
  baseURL: apiUrl, 
});

export const login = (data) => API.post("/login", data);

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  return fetch(`${apiUrl}${endpoint}`, {
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
