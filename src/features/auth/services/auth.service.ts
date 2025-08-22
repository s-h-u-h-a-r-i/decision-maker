import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
  signOut,
  onAuthStateChanged,
  Unsubscribe,
  IdTokenResult,
} from "firebase/auth";
import { fbAuth } from "../../../configs";
import { AppUser } from "../types";
import { FirebaseError } from "firebase/app";

export interface AuthServiceError {
  code: string;
  message: string;
}

const errorMap: Record<string, string> = {
  "auth/user-not-found": "No user found with this email address",
  "auth/wrong-password": "Incorrect password",
  "auth/email-already-in-use": "An account with this email already exists",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/invalid-email": "Invalid email address",
  "auth/user-disabled": "This account has been disabled",
  "auth/too-many-requests": "Too many failed attempts. Please try again later",
  "auth/network-request-failed": "Network error. Please check your connection",
  "auth/popup-closed-by-user": "Sign-in popup was closed",
  "auth/cancelled-popup-request": "Sign-in was cancelled",
} as const;

class AuthService {
  #auth = fbAuth;

  onAuthStateChanged(callBack: (user: AppUser | null) => void): Unsubscribe {
    return onAuthStateChanged(this.#auth, callBack);
  }

  async signInWithGoogle(): Promise<AppUser> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.#auth, provider);
      return this.#mapFbUserToAppUser(userCredential.user);
    } catch (err) {
      throw this.#handleAuthError(err as FirebaseError);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.#auth);
    } catch (err) {
      throw this.#handleAuthError(err as FirebaseError);
    }
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    try {
      const user = this.#auth.currentUser;
      if (!user) return null;
      return await user.getIdToken(forceRefresh);
    } catch (err) {
      console.error("Failed to get ID token:", err);
      return null;
    }
  }

  async getIdTokenResult(forceRefresh = false): Promise<IdTokenResult | null> {
    try {
      const user = this.#auth.currentUser;
      if (!user) return null;
      return await user.getIdTokenResult(forceRefresh);
    } catch (err) {
      console.error("Failed to get ID token result:", err);
      return null;
    }
  }

  #mapFbUserToAppUser(user: User): AppUser {
    return {
      ...user,
    };
  }

  #handleAuthError(error: FirebaseError): AuthServiceError {
    return {
      code: error.code || "unknown",
      message:
        errorMap[error.code] || error.message || "An unexpected error occurred",
    };
  }
}

export const authService = new AuthService();
export type { AuthService };
