import { handleRequest } from '../../config';
import { API } from '../../config/api';

class ErrorApi {
  async sendError({ data, token }: any): Promise<any> {
    return handleRequest(
      API.post(`/api/application-errors`, data, {
        headers: {
          'Content-Type': '',
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }
}

export default ErrorApi;
