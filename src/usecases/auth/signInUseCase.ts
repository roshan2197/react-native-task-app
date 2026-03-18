import { login } from '../../services/auth';

export type SessionMode = 'mock' | 'live';

export type SessionUser = {
  username: string;
  mode: SessionMode;
};

export const signInUseCase = async (
  username: string,
  password: string,
): Promise<SessionUser> => {
  const response = await login(username.trim(), password);

  return {
    username: response?.user?.username || username.trim(),
    mode: response?.mode === 'mock' ? 'mock' : 'live',
  };
};
