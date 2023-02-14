import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_PRO_MODE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
