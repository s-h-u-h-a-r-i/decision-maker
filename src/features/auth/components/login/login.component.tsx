import { Component } from "solid-js";
import styles from "./login.module.css";
import { useAuth } from "../../store";

const Login: Component = () => {
  const auth = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await auth.signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div class={styles.loginContainer}>
      <div class={styles.loginCard}>
        <h1>Welcome to Decision Maker</h1>
        <p>Please sign in to continue</p>

        <button
          onClick={handleGoogleSignIn}
          disabled={auth.state().isLoading}
          class={styles.googleSignInBtn}>
          {auth.state().isLoading ? "Signing in..." : "Sign in with Google"}
        </button>

        {auth.state().error && (
          <div class={styles.errorMessage}>
            {auth.state().error?.message}
            <button onClick={auth.clearError} class={styles.clearErrorBtn}>
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
