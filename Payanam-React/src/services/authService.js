// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:8080/auth";

const signup = async (data) => axios.post(`${API_URL}/signup`, data);
const login = async (data) => axios.post(`${API_URL}/login`, data);
const driverSignup = async (data) => axios.post(`${API_URL}/driver/signup`, data);
const driverLogin = async (data) => axios.post(`${API_URL}/driver/login`, data);
const adminLogin = async (data) => axios.post(`${API_URL}/admin/login`, data);

export default { signup, login, driverSignup, driverLogin, adminLogin };
