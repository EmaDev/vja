import { FirebaseError } from "firebase/app";

const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/wrong-password": "Email o contraseña incorrectos.",
  "auth/user-not-found": "Email o contraseña incorrectos.",
  "auth/invalid-email": "El email no es válido.",
  "auth/user-disabled": "Esta cuenta fue deshabilitada.",
  "auth/too-many-requests": "Demasiados intentos. Probá de nuevo en unos minutos.",
  "auth/network-request-failed": "Error de conexión. Revisá tu internet.",
};

const DEFAULT_MESSAGE = "No se pudo iniciar sesión. Intentá de nuevo.";

export function mapFirebaseAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    return MESSAGES[error.code] ?? DEFAULT_MESSAGE;
  }

  return DEFAULT_MESSAGE;
}
