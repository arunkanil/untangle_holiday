import { GetCurrentLoginInformations } from './dto/getCurrentLoginInformations';
import http from '../httpService';

declare var abp: any;

class SessionService {
  public async getCurrentLoginInformations(): Promise<GetCurrentLoginInformations> {
    let result = await http.get('api/services/app/Session/GetCurrentLoginInformations');
    let userId = localStorage.getItem('userID');
    console.log("GetCurrentLoginInformation : ", result);

    if(userId !=null && abp.auth.getToken()!=null && userId.length>0 && abp.auth.getToken().length > 0) {
      console.log("user data injection condition true");
      let userDetRes = await http.get('api/services/app/User/Get?Id=' + userId);
      console.log("User data result: ", userDetRes);
      let user = {
        "name": userDetRes.data.result.name,
        "surname": userDetRes.data.result.surname,
        "userName": userDetRes.data.result.userName,
        "emailAddress": userDetRes.data.result.emailAddress,
        "id": userDetRes.data.result.id
      }
      result.data.result.user = user;
      console.log("GetCurrentLoginInformation after injection: ", result);
    } else {
      console.log("user data injection condition false");
      console.log("User: ",userId);
      console.log("ABP Token: ", abp.auth.getToken());
    }
    
    if (result.data.result.user) {
      localStorage.setItem('name', result.data.result.user.name + ' ' + result.data.result.user.surname);
    }
    return result.data.result;
  }
}

export default new SessionService();
