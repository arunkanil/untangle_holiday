export interface AuthenticationModel {
  userNameOrEmailAddress: string;
  password: string;
  // rememberClient: boolean;
  useAzureAD: boolean;
}
