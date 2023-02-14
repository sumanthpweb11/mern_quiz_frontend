import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
