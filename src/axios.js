import axios from "axios";

const instance = axios.create({
  baseURL: "https://developmentapp.lacasacode.dev/api/v1",
});

export default instance;
