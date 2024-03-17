export interface IAuthPayload {
  identifier: string;
  password: string;
}

export interface IAuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    phone: string;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    device_id: string;
  };
}
