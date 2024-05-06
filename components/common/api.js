const local = 'http://192.168.1.100:3000';
const localOffice = 'http://172.16.1.232:3000';
const live = '127.0.0.1:3000';

const api = localOffice;

export const allUsersAPI = `${api}/users`;
export const signinAPI = `${api}/users/signin`;
export const saveUserAPI = `${api}/users/saveUser`;
export const sigupAPI = `${api}/users/signup`;
export const sendEmailAPI = `${api}/users/sendEmail`;
export const updateProfileAPI = `${api}/users/updateUser`;
export const updateProfileImageAPI = `${api}/users/updateImage`;
