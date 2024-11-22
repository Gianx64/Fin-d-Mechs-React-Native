import axios from "axios";

export default axios.create({
  //baseURL: "http://10.2.139.118/api",
  baseURL: "http://10.2.139.73/api",
  responseType: 'json',
  withCredentials: true
});
