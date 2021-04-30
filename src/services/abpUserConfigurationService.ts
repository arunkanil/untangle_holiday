import http from './httpService';

declare var abp: any;

class AbpUserConfigurationService {
  public async getAll() {
    const result = await http.get('/AbpUserConfiguration/GetAll');
    let userId = localStorage.getItem('userID');
    if(userId !=null && abp.auth.getToken()!=null && userId.length>0 && abp.auth.getToken().length > 0) {
      result.data.result.session.userId = userId;
      console.log("GetAll user data injection condition true");
      let userGrantedRoles = await http.get('api/HmsUserConfiguration/GetUserGrantedPermissions?id=' + userId);
      console.log("granted permissions data result: ", userGrantedRoles);
      result.data.result.auth.grantedPermissions = userGrantedRoles.data.result;
      console.log("GetAll data after injection: ", result);
    } else {
      console.log("Get All user data injection condition false");
      console.log("User: ",userId);
      console.log("ABP Token: ", abp.auth.getToken());
    }
    return result;
  }
}

export default new AbpUserConfigurationService();
