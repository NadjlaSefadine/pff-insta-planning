import { jwtDecode } from 'jwt-decode';

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const t = getToken();
  if (!t) {
    console.log("Missing Token.");

    return null
  };
  try {
    const decoded = jwtDecode(t);
    return decoded;
  } catch (err) {
    console.log(err);

    return null;
  }
}