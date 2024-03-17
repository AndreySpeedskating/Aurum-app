import api from '../api';
import { IApplicationResponse } from '../api/content/interface';

type DefaultPayload = {
  jwt: string;
  cbSuccess?: (data?: any) => void;
  cbError?: (data?: any) => void;
  page?: number;
};

export const getAutoPark = async ({ jwt, cbSuccess, cbError }: DefaultPayload): Promise<any> => {
  await api.content
    .getAutoPark(jwt)
    .then((response) => {
      cbSuccess?.(response?.map((a) => ({ ...a, name: a.GarageNumber })));
      return response;
    })
    .catch((error) => {
      console.log('getAutoPark', error);
      cbError?.();
    });
};

export const getLoadingPoint = async ({
  jwt,
  cbSuccess,
  cbError,
  cbFinally,
}: DefaultPayload & { cbFinally?: () => void }): Promise<any> => {
  await api.content
    .getLoadingPoints(jwt)
    .then((response) => {
      cbSuccess?.(response);
      return response;
    })
    .catch((error) => {
      console.log('getLoadingPoint', JSON.stringify(error));
      cbError?.();
    })
    .finally(() => {
      cbFinally?.();
    });
};

export const getUnLoadingPoint = async ({
  jwt,
  cbSuccess,
  cbError,
  cbFinally,
}: DefaultPayload & { cbFinally?: () => void }): Promise<any> => {
  await api.content
    .getUnLoadingPoints(jwt)
    .then((response) => {
      cbSuccess?.(response);
      return response;
    })
    .catch((error) => {
      console.log('getLoadingPoint', error);
      cbError?.();
    })
    .finally(() => {
      cbFinally?.();
    });
};

export const getConterparies = async ({
  jwt,
  cbSuccess,
  cbError,
}: DefaultPayload): Promise<any> => {
  await api.content
    .getCounterparties(jwt)
    .then((response) => {
      cbSuccess?.(response);
      return response;
    })
    .catch((error) => {
      console.log('getConterparies', error);
      cbError?.();
    });
};

export const getMyApplications = async ({
  jwt,
  userId,
  cbSuccess,
  cbError,
}: DefaultPayload & { userId: number }): Promise<IApplicationResponse[] | void> => {
  await api.content
    .getMyApplication(userId, jwt)
    .then((response) => {
      cbSuccess?.(response);
      return response;
    })
    .catch((error) => {
      console.log('getMyApplications', error);
      cbError?.();
    });
};
