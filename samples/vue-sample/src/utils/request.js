import axios from 'axios';

const request = axios.create({
  baseURL:process.env.VUE_APP_API_BASE_URL,
  timeout:6000
});

request.interceptors.response.use((response)=>{
  return response.data;
});

export default request;