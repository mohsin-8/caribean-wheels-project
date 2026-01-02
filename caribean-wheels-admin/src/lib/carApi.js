import axios from "axios";

const carApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/car",
  withCredentials: true,
});

export default carApi;