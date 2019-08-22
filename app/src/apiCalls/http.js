import axios from "axios";

import config from "../config";

const http = axios.create({
  baseURL: config.apiURL,
  timeout: 3000
});

export default http;
