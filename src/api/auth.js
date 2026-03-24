import api from './axios';

const extractToken = (payload) => {
  return payload?.token ?? payload?.jwt_token ?? payload?.access_token ?? null;
};

export const login = async ({ username, password }) => {
  const response = await api.post('/api/v1/token', {
    username,
    password,
  });

  const token = extractToken(response.data);

  if (!token) {
    throw new Error('Токен отсутствует в ответе логина. Проверьте имя поля токена в miniOrange.');
  }

  return {
    ...response.data,
    token,
  };
};

export const register = async () => {
  throw new Error('Регистрация отключена, пока не настроен backend endpoint.');
};

export const validateToken = async () => {
  const response = await api.get('/api/v1/token-validate');
  return response.data;
};
