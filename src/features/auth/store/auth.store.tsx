import {
  createContext,
  createSignal,
  onCleanup,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js";
import { AppUser } from "../types";
import { authService, AuthServiceError } from "../services";

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthServiceError | null;
}

export interface AuthContextValue {
  state(): AuthState;

  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  clearError(): void;
}

const AuthContext = createContext<AuthContextValue>();

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<AppUser | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<AuthServiceError | null>(null);

  const isAuthenticated = () => !!user();

  const state = (): AuthState => ({
    user: user(),
    isLoading: isLoading(),
    isAuthenticated: isAuthenticated(),
    error: error(),
  });

  const clearError = () => setError(null);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      clearError();
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err as AuthServiceError);
      throw err;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      await authService.signOut();
    } catch (err) {
      setError(err as AuthServiceError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    onCleanup(unsubscribe);
  });

  const contextValue: AuthContextValue = {
    state,
    signInWithGoogle,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
