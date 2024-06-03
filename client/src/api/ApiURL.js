import axios from 'axios';

const BaseURL = process.env.NODE_ENV = "production"
    ? "http://hocalhost:5000"
    : "http://localhost:5000"

export default axios.create({
    BaseURL,
})