import axios from 'axios';


// Register user
export const registerUser = async (data) => {
    const res = await axios.post(`http://localhost:3000/api/auth/register`, data);
    console.log("done")
    return res.data;
}

// Login user
export const loginUser = async (data) => {
    const res = await axios.post(`http://localhost:3000/api/auth/login`, data);
    return res.data;
}

export const googleLogin = () => {
  window.location.href = `http://localhost:3000/api/auth/google`;
};  