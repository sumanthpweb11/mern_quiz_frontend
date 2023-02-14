import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mern-quiz-api.onrender.com",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
