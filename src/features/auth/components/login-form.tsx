"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/shared/lib/auth-context";
import { ApiError } from "@/shared/lib/api";
import { loginWithGoogle, loginWithFacebook } from "@/shared/lib/services/auth";

interface FBAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

interface FBStatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FBAuthResponse;
}

declare global {
  interface Window {
    FB: {
      init: (config: object) => void;
      getLoginStatus: (callback: (response: FBStatusResponse) => void) => void;
      login: (
        callback: (response: FBStatusResponse) => void,
        options: { scope: string },
      ) => void;
      AppEvents: {
        logPageView: () => void;
      };
    };
    fbAsyncInit: () => void;
  }
}

export function LoginForm() {
  const router = useRouter();
  const { login, refreshUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fbLoaded, setFbLoaded] = useState(false);

  // Maneja el cambio de estado de login de Facebook.
  // connected   → la persona ya inició sesión en Facebook y en la app → auto-login.
  // not_authorized / unknown → mostrar el botón de inicio de sesión.
  const statusChangeCallback = useCallback(
    async (response: FBStatusResponse) => {
      if (response.status === "connected" && response.authResponse) {
        const { accessToken, userID } = response.authResponse;
        setLoading(true);
        try {
          await loginWithFacebook(accessToken, userID);
          await refreshUser();
          toast.success("Sesión iniciada con Facebook.");
          router.push("/");
        } catch (err) {
          const msg =
            err instanceof ApiError
              ? err.data.message
              : "Error al iniciar sesión con Facebook.";
          toast.error(msg);
        } finally {
          setLoading(false);
        }
      }
    },
    [router, refreshUser],
  );

  // Consulta el estado actual de login con Facebook y llama a statusChangeCallback.
  const checkLoginState = useCallback(() => {
    window.FB.getLoginStatus((response) => {
      statusChangeCallback(response);
    });
  }, [statusChangeCallback]);

  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
      window.FB.AppEvents.logPageView();
      setFbLoaded(true);

      // Al cargar la página, comprobar si ya inició sesión
      window.FB.getLoginStatus((response) => {
        statusChangeCallback(response);
      });
    };

    if (document.getElementById("facebook-jssdk")) {
      setFbLoaded(true);
      return;
    }

    const d = document;
    const s = "script";
    const id = "facebook-jssdk";
    const fjs = d.getElementsByTagName(s)[0];
    const js = d.createElement(s) as HTMLScriptElement;
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode!.insertBefore(js, fjs);
  }, [statusChangeCallback]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username, password });
      toast.success("Sesión iniciada correctamente.");
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data.message || "Credenciales inválidas.");
      } else {
        setError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
        await refreshUser();
        toast.success("Sesión iniciada con Google.");
        router.push("/");
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.data.message
            : "Error al iniciar sesión con Google.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Error al iniciar sesión con Google."),
  });

  // Abre el diálogo de login de Facebook y luego llama a checkLoginState
  // para obtener el estado actualizado, igual que haría <fb:login-button onlogin="checkLoginState()">
  function handleFacebookLogin() {
    if (!fbLoaded || loading) return;
    window.FB.login(
      () => {
        checkLoginState();
      },
      { scope: "public_profile,email" },
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
        <p className="text-sm text-muted-foreground">
          Inicia sesión en tu cuenta
        </p>
      </div>

      <Separator />

      {/* Botones sociales */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => googleLogin()}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar con Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleFacebookLogin}
          disabled={!fbLoaded || loading}
        >
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continuar con Facebook
        </Button>
      </div>

      {/* Divisor */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            o continuar con
          </span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Usuario o correo electrónico
          </label>
          <Input
            id="username"
            type="text"
            placeholder="tu_usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-foreground">
          Crear una
        </Link>
      </p>
    </div>
  );
}
