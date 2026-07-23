import axios from "axios";

const API = axios.create({

baseURL:"http://localhost:8000"

})

API.interceptors.request.use((req)=>{

const token=localStorage.getItem("token")

const publicRoutes=[

"/login",
"/register"

]

const isPublic=publicRoutes.some(
route => req.url.includes(route)
)

if(token && !isPublic){

req.headers.Authorization=
`Bearer ${token}`

}

return req

})

export default API