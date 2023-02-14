import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mern-quiz-app-api.onrender.com",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
