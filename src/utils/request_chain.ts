// src/utils/axiosClient.js 或 src/apis/apiClient.js
import axios from 'axios';

const chainApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAIN_RPC,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

chainApiClient.interceptors.request.use(
  (config) => {
    // can do something before request is sent，like insert token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

chainApiClient.interceptors.response.use(
  (response) => {
    // can do something after response is received
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default chainApiClient;
