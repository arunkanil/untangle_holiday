import { message } from 'antd';
import Axios from 'axios';
import Cookies from 'js-cookie';
import AppConsts from '../lib/appconst';

Axios.defaults.baseURL = AppConsts.remoteServiceBaseUrl;

const headers = {
  headers: { Authorization: `Bearer ${Cookies.get('Abp.AuthToken')}` },
};
export async function GetAPICall(url) {
  let result = await Axios.get(url, headers).catch(function (error) {
    // handle error
    console.log(error.response);
    message.error(error.response.data.error.message);
    return error.response;
  });
  return result.data;
}
export async function PostAPICall(url, value) {
  let result = await Axios.post(url, value, headers).catch(function (error) {
    // handle error
    console.log(error.response);
    message.error(error.response.data.error.message);
    return error.response;
  });
  return result.data;
}
export async function DeleteAPICall(url, value) {
  let result = await Axios.delete(`${url}${value}`, headers).catch(function (error) {
    // handle error
    console.log(error.response);
    message.error('record cannot be deleted');
    message.error(error.response.data.error.message);
    return error.response;
  });
  // .then((res) => {
  //   console.log(res,"in dataservice");
  //   return res.data;
  // })
  // .catch((error) => {
  //   // handle error
  //   console.log(error.response);
  //   // message.error(error.response.data.error.message);
  //   message.error('record cannot be deleted');
  //   return error;
  // });
  return result.data;
}
export async function PutAPICall(url, value) {
  let result = await Axios.put(url, value, headers).catch(function (error) {
    // handle error
    console.log(error.response);
    message.error(error.response.data.error.message);
    return error.response;
  });
  return result.data;
}
