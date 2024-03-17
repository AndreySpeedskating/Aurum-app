import { handleRequest } from '../../config';
import { API } from '../../config/api';
import { IAuthResponse } from '../auth/interface';
import {
  IApplicationResponse,
  IAutoPark,
  IConterpartieResponse,
  ILoadingPoint,
  IMeta,
} from './interface';

class ContentApi {
  async getMyApplication(userId: number, token: string): Promise<IApplicationResponse[]> {
    return handleRequest(
      API.get(`dictionaries/my-applications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  }

  async createMyApplication({
    data,
    token,
  }: {
    data: any;
    token: string;
  }): Promise<{ data: IApplicationResponse }> {
    return handleRequest(
      API.post(`applications`, { data }, { headers: { Authorization: `Bearer ${token}` } })
    );
  }

  async updateMyApplication({
    data,
    token,
    id,
  }: {
    id: number;
    data: any;
    token: string;
  }): Promise<IApplicationResponse[]> {
    return handleRequest(
      API.put(`applications/${id}`, { data }, { headers: { Authorization: `Bearer ${token}` } })
    );
  }

  async getAutoPark(token: string): Promise<IAutoPark[]> {
    return handleRequest(
      API.get(`dictionaries/autopark`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  }

  async getLoadingPoints(token: string): Promise<ILoadingPoint[]> {
    return handleRequest(
      API.get(`dictionaries/loading-points`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  }

  async getUnLoadingPoints(token: string): Promise<ILoadingPoint[]> {
    return handleRequest(
      API.get(`dictionaries/unloading-points`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  }

  async getCounterparties(token: string): Promise<IConterpartieResponse[]> {
    return handleRequest(
      API.get(`dictionaries/conterparties`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  }

  async updateUserDeviceId({
    token,
    id,
    device_id,
  }: {
    token: string;
    id: number;
    device_id: string;
  }): Promise<IAuthResponse> {
    return handleRequest(
      API.post(
        `dictionaries/update-device-id/${id}`,
        { device_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    );
  }

  async uploadPhoto({ data, token }: any): Promise<any> {
    return handleRequest(
      API.post(`upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }
}

export default ContentApi;
