import { action, observable } from 'mobx';

import AppConsts from './../lib/appconst';
import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';

declare var abp: any;

class AuthenticationStore {
  @observable loginModel: LoginModel = new LoginModel();

  get isAuthenticated(): boolean {
    if (!abp.session.userId) return false;

    return true;
  }

  @action
  public async login(model: LoginModel) {
    let result = await tokenAuthService.authenticate({
      userNameOrEmailAddress: model.userNameOrEmailAddress,
      password: model.password,
      // rememberClient: model.rememberMe,
      useAzureAD: model.useAzureAD,
    });
    console.log(result);
    // var tokenExpireDate = model.rememberMe ? new Date(new Date().getTime() + 1000 * result.expireInSeconds) : undefined;
    var tokenExpireDate = new Date(new Date().getTime() + 1000 * result.expireInSeconds);
    console.log("token expiry", tokenExpireDate.toDateString());
    await abp.auth.setToken(result.accessToken, tokenExpireDate);
    await abp.utils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName, result.encryptedAccessToken, tokenExpireDate, abp.appPath);
    console.log("Abp.auth.Token ", await abp.auth.getToken());
    console.log("ABP session token and cookie set", await abp.session);
    //Save SOme Data for later use
    await localStorage.setItem('userName', model.userNameOrEmailAddress);
    await localStorage.setItem('userID', result.userId.toString());
    return result;
  }

  @action
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    abp.auth.clearToken();
  }
}
export default AuthenticationStore;
