import axios from 'axios';
var instance = axios.create({ headers: {'content-type': 'application/json'} });
// var instance = axios.create({ headers: {'content-type': 'application/x-www-form-urlencoded'} });
let base = '';

export const requestLogin = params => { return instance.post(`/api/enter/post`, params).then(res => res.data); };
// export const requestLogin = params => { return instance.get(`/api/enter/Get`, { params: params }); };

export const getUserListPage = params => { return instance.get(`/api/enter/Getbookinfo`, { params: params }); };

export const getPageCount = params => { return instance.get(`/api/enter/Getcount`, { params: params }); };

export const searchBooksListPage = params => { return instance.get(`/api/searchbook/get`, { params: params }); };

export const getSearchIsbn = isbn => { return instance.get(`/v2/book/isbn/`+isbn, {}); };

export const addBooksList = params => { return instance.get(`/api/bookisbn/get`, { params: params }); };

export const removeBook = params => { return instance.get(`/api/bookisbn/get2`, { params: params }); };

export const editBook = params => { return instance.get(`/api/bookisbn/get5`, { params: params }); };


export const distributorGetcount = params => { return instance.get(`/api/distributor/Getcount`, { params: params }); };

export const distributorGetqurey = params => { return instance.get(`/api/distributor/Getqurey`, { params: params }); };

export const distributorGetadd = params => { return instance.get(`/api/distributor/Getadd`, { params: params }); };

export const searchDistributorbook = params => { return instance.get(`/api/distributor/Getonequrey`, { params: params }); };

export const distributorGetdelete = params => { return instance.get(`/api/distributor/Getdelete`, { params: params }); };

export const distributorGetupdate = params => { return instance.get(`/api/distributor/Getupdate`, { params: params }); };

export const distributorGetaddmsg = params => { return instance.get(`/api/distributor/Getaddmsg`, { params: params }); };

export const examineGetqurey = params => { return instance.get(`/api/examine/Getqurey`, { params: params }); };

export const examineGetonequrey = params => { return instance.get(`/api/examine/Getonequrey`, { params: params }); };

export const examineGetcount = params => { return instance.get(`/api/examine/Getcount`, { params: params }); };

export const examineGetupdate = params => { return instance.get(`/api/examine/Getupdate`, { params: params }); };

export const examineGetmsg = params => { return instance.get(`/api/examine/Getmsg`, { params: params }); };

export const examineGetdeal = params => { return instance.get(`/api/examine/Getdeal`, { params: params }); };

export const examineDelete = params => { return instance.get(`/api/examine/Getdelete`, { params: params }); };
