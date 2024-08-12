import io from 'socket.io-client';
const local = 'http://192.168.1.100:3000';
const localOffice = 'http://172.16.1.232:3000';
const live = '127.0.0.1:3000';

const api = localOffice;
export const socketURL = api;

export const socket = io(socketURL);

export const allUsersAPI = `${api}/users/profile`;
export const signinAPI = `${api}/users/signin`;
export const saveUserAPI = `${api}/users/saveUser`;
export const sigupAPI = `${api}/users/signup`;
export const sendEmailAPI = `${api}/users/sendEmail`;
export const updateProfileAPI = `${api}/users/updateUser`;
export const updateProfileImageAPI = `${api}/users/updateImage`;
export const logoutAPI = `${api}/users/logout`;
export const getDashboard = `${api}/users/getDashboard`;
export const getVehicles = `${api}/users/getVehicles`;
export const getLocationsAPI = `${api}/users/getLocations`;
export const rateDriver = `${api}/users/rateDriver`;
export const searchVehicles = `${api}/users/searchVehicles`;
export const getVehicleDetails = `${api}/users/getVehicleDetails`;
export const getFavorites = `${api}/users/getFavorites`;
export const addUpdateFavorites = `${api}/users/addUpdateFavorites`;
