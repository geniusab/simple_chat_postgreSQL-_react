import AuthService from "./../../services/authService";

export async function AuthLogin({ email, password }) {
  return await AuthService.login({ email, password });
}

export async function AuthRegister(data) {
  return await AuthService.register(data);
}

export async function AuthUpdateProfile(data) {
  return await AuthService.updateProfile(data);
}
