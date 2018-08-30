export interface LoginResponse {
  "access_token": string;
  "token_type": string;
  "expires_in": number;
  "refresh_token": string;
  "as:client_id": string;
  "userName": string;
  ".issued": Date;
  ".expires": Date;
}
