import { UserCreate } from '../types/auth';

// Эта функция соответствует ожиданиям AuthContext
export const register = async (data: UserCreate) => {
  const response = await fetch(`/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка регистрации');
  }

  return response.json();
};

// Эта функция соответствует ожиданиям AuthContext
export const login = async (loginName: string, password_str: string) => {
  const body = new URLSearchParams();
  body.append('grant_type', '');
  body.append('username', loginName);
  body.append('password', password_str);
  body.append('scope', '');
  body.append('client_id', '');
  body.append('client_secret', '');

  const response = await fetch(`/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json',
    },
    body: body,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка входа');
  }

  return response.json();
};

// Заглушка для функции refresh, чтобы исправить ошибку в client.ts
export const refresh = async () => {
  console.warn('Функция refresh не реализована');
  // В будущем здесь будет логика обновления токена
  return Promise.resolve({ access_token: '' });
};
