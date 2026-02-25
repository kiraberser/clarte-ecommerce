import type {
  ApiResponse,
  AuthTokens,
  User,
  RegisterData,
  LoginData,
} from "@/shared/types/api";
import { apiPost, apiGet, apiPatch, setTokens, clearTokens } from "@/shared/lib/api";

export async function login(credentials: LoginData) {
  const tokens = await apiPost<AuthTokens>("/auth/login/", credentials);
  setTokens(tokens.access, tokens.refresh);
  return tokens;
}

export async function register(data: RegisterData) {
  const res = await apiPost<ApiResponse<{ user: User; tokens: AuthTokens }>>(
    "/auth/registro/",
    data,
  );
  const { tokens } = res.data;
  setTokens(tokens.access, tokens.refresh);
  return res.data;
}

export async function logout(refreshToken: string) {
  try {
    await apiPost("/auth/logout/", { refresh: refreshToken }, true);
  } finally {
    clearTokens();
  }
}

export async function refreshAccessToken(refreshToken: string) {
  const tokens = await apiPost<AuthTokens>("/auth/refresh/", {
    refresh: refreshToken,
  });
  setTokens(tokens.access, tokens.refresh);
  return tokens;
}

export async function getProfile() {
  const res = await apiGet<ApiResponse<User>>("/usuarios/perfil/", true);
  return res.data;
}

export async function updateProfile(data: Partial<User>) {
  const res = await apiPatch<ApiResponse<User>>(
    "/usuarios/perfil/",
    data,
    true,
  );
  return res.data;
}

export async function requestPasswordReset(email: string) {
  return apiPost("/auth/solicitar-reset/", { email });
}

export async function confirmPasswordReset(
  uid: string,
  token: string,
  password: string,
  password_confirm: string,
) {
  return apiPost("/auth/reset-password/", { uid, token, password, password_confirm });
}

export async function loginWithGoogle(access_token: string) {
  const tokens = await apiPost<AuthTokens>("/auth/google/", { access_token });
  setTokens(tokens.access, tokens.refresh);
  return tokens;
}

export async function loginWithFacebook(accessToken: string, userID: string) {
  const tokens = await apiPost<AuthTokens>("/auth/facebook/", { accessToken, userID });
  setTokens(tokens.access, tokens.refresh);
  return tokens;
}
