import { AxiosResponse } from 'axios';

const handleRequest = async <T>(callback: Promise<AxiosResponse>): Promise<T> => {
  const result = await callback.then(({ data }: AxiosResponse) => data);

  // string добавлен для того, чтобы корректно возвращался токен с бэка
  const isValidResponse =
    result instanceof Array || result instanceof Object || typeof result === 'string';

  if (isValidResponse) {
    return result;
  }

  throw new Error('Invalid data structure');
};

export default handleRequest;
