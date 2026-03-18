import { API } from './api';

const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

export const login = async (username: string, password: string) => {
  if (!API.defaults.baseURL) {
    await delay(300);

    return {
      token: 'local-dev-token',
      user: { username },
      mode: 'mock',
    };
  }

  const res = await API.post('/login', {
    username,
    password,
  });

  return res.data;
};
