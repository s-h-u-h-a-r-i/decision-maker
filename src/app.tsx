import type { Component } from "solid-js";
import { Show, lazy } from "solid-js";

import styles from "./app.module.css";
import { AuthProvider, useAuth } from "./features/auth/";

const Login = lazy(() => import("./features/auth/components/login"));
const DecisionDashboard = lazy(
  () => import("./features/decisions/components/decision-dashboard"),
);

const AppContent: Component = () => {
  const auth = useAuth();

  return (
    <main class={styles.App}>
      <Show when={!auth.state().isLoading} fallback={<div>Loading...</div>}>
        <Show when={auth.state().isAuthenticated} fallback={<Login />}>
          <DecisionDashboard />
        </Show>
      </Show>
    </main>
  );
};

const App: Component = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
