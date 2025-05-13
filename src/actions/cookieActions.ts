'use server';

import { cookies } from 'next/headers';

export const getCookie = async (cookieName: string) => {
  const cookie = await cookies();
  return cookie.get(cookieName)?.value;
};

export const setCookie = async (
  cookieName: string,
  value: string,
  options?: any,
) => {
  const cookie = await cookies();
  cookie.set(cookieName, value, options);
  return { success: true };
};

export const removeCookie = async (cookieName: string) => {
  const cookie = await cookies();
  cookie.delete(cookieName);
  return { success: true };
};

