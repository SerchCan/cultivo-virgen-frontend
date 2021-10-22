import axios from 'axios';

axios.defaults.baseURL = "http://localhost:4000/";

const api = {
  getFromEndpoint: async(endpoint) => await axios.get(endpoint),
  putFromEndpoint: async(endpoint,params={}) => await axios.put(endpoint,params),
  postFromEndpoint: async(endpoint,params={}) => await axios.post(endpoint,params),
  deleteFromEndpoint: async(endpoint,params={}) => await axios.delete(endpoint,params),
  postProduct: async()=> await axios.post('/product'),
  getProducts: async()=> await axios.get('/product/find'),

  saveLogbook: async(params={})=> await axios.post('/logbook/save',params),
  getLogbook: async(params={})=> await axios.post('/logbook/get',params),
}
export default api;