import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "https://sistema-vivaz-backend.onrender.com";

console.log("🔍 API URL:", process.env.REACT_APP_API_URL);

const API = axios.create({
  baseURL: apiUrl, 
});

export const login = (data) => API.post("/login", data);

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  return fetch(`${apiUrl}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export default fetchWithAuth;
