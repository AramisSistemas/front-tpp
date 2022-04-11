import axios from 'axios' 
const request = axios.create({
 baseURL: 'https://localhost:7120',
// baseURL: 'https://tppsa.azurewebsites.net', //la oficial
})

request.interceptors.request.use(
  request => {
    const token = localStorage.getItem('token')
    if (token) { 
      request.headers.Authorization ='Bearer '+ token
    }      
    return request
  },
  error => {   
    return Promise.reject(error)
  }
)

export default request
