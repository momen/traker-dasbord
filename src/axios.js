import axios from "axios";

const instance = axios.create({
  baseURL: "https://development.lacasacode.dev/api/v1",
});


export default instance;
