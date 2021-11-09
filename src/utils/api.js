import axios from 'axios';

const apis = {
  production: 'https://api.cultivo-virgen.link/',
  development: 'http://localhost:4000/'
}
axios.defaults.baseURL = apis[process.env.NODE_ENV];

const api = {
  getFromEndpoint: async (endpoint) => await axios.get(endpoint),
  putFromEndpoint: async (endpoint, params = {}) => await axios.put(endpoint, params),
  postFromEndpoint: async (endpoint, params = {}) => await axios.post(endpoint, params),
  deleteFromEndpoint: async (endpoint, params = {}) => await axios.delete(endpoint, params),
  postProduct: async () => await axios.post('/product'),
  getProducts: async () => await axios.get('/product/find'),
  getProductsByCategory: async (category) => await axios.get(`/product/findByCategory/${category}`),
  findProduct: async (params) => await axios.get(`/product/find/${params}`),
  saveLogbook: async (params = {}) => await axios.post('/logbook/save', params),
  getLogbook: async (params = {}) => await axios.post('/logbook/get', params),
  getUsersByRole: async (params = {}) => await axios.post('/management/getUsersByRole', params),
  getUserRole: async (params={}) => await axios.post('/management/getUserRole', params),
  exportLogbook: async (params={}) => await axios.post('/logbook/export', params,{
    responseType: 'arraybuffer',
  }),

  
}
export default api;