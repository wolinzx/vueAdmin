import axios from 'axios';
var instance = axios.create({ headers: {'content-type': 'application/json'} });
// var instance = axios.create({ headers: {'content-type': 'application/x-www-form-urlencoded'} });
let base = '';

export const requestLogin = params => { return instance.post(`/api/enter/post`, params).then(res => res.data); };
// export const requestLogin = params => { return instance.get(`/api/enter/Get`, { params: params }); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return instance.get(`/api/enter/Getbookinfo`, { params: params }); };
export const getPageCount = params => { return instance.get(`/api/enter/Getcount`, { params: params }); };
export const searchBooksListPage = params => { return instance.get(`/api/searchbook/get`, { params: params }); };
export const getSearchIsbn = isbn => { return instance.get(`/v2/book/isbn/`+isbn, {}); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); }; 