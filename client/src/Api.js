import axios from 'axios'

// Create an axios instance for v1 API
export const ApiV1 = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/v1'
})

// Create an axios instance for v2 API
export const ApiV2 = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/v2'
})
