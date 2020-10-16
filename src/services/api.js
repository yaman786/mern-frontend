import axios from 'axios';

const api =  axios.create({
    baseURL:'https://bootcamp-mern-api.herokuapp.com/'
})

export default api;