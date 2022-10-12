import axios from "axios";

const Axios = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Accept: "application/json",
    withCredentials: false,
  }
});

export default class ApiService {
  constructor() {}
  async get(url) {
    return await Axios.get(url, {
      headers: {
        Authorization:
          'Bearer '+ window.localStorage.getItem("token"),
      }
    });
  }

  async post(url, body) {
    return await Axios.post(url, body, {
      headers: {
        Authorization: 'Bearer '+ window.localStorage.getItem("token"),
      }
    });
  }

  async put(url, body) {
    return await Axios.put(url, body, {
      headers: {
        Authorization: 'Bearer '+ window.localStorage.getItem("token"),
      }
    });
  }

  async delete(url) {
    return await Axios.delete(url, {
      headers: {
        Authorization: 'Bearer '+ window.localStorage.getItem("token"),
      }
    });
  }
}