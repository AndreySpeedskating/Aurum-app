import { handleRequest } from '../../config';
import { API } from '../../config/api';
import { IAuthPayload, IAuthResponse } from './interface';

class AuthApi {
  async loginUser({ identifier, password }: IAuthPayload): Promise<IAuthResponse> {
    return handleRequest(API.post('auth/local', { identifier, password }));
  }
}

export default AuthApi;
