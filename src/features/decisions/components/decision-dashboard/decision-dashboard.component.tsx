import { Component, For, Match, Switch } from "solid-js";

import { Decision } from "../../types";
import { useDecision } from "../../store";
import { DecisionCard, DecisionCardAdd } from "../decision-card";
import styles from "./decision-dashboard.module.css";

const LoadingState: Component<{ message?: string }> = (props) => (
  <div class={styles.stateMessage} role="status" aria-live="polite">
    <div class={styles.loadingSpinner}></div>
    <span>{props.message || "Loading decisions..."}</span>
  </div>
);

const ErrorState: Component<{ error: string }> = (props) => (
  <div class={styles.stateMessage} role="alert">
    <div class={styles.errorIcon}>⚠️</div>
    <div class={styles.errorContent}>
      <h3>Unable to load decisions</h3>
      <p>{props.error}</p>
    </div>
  </div>
);

const EmptyState: Component = () => (
  <div class={styles.decisionsGrid} role="list" aria-label="">
    <div role="listbox" aria-setsize={1} aria-posinset={1}>
      <DecisionCardAdd />
    </div>
  </div>
);

const DecisionDashboard: Component = () => {
  const decisionStore = useDecision();
  const decisionState = decisionStore.state;

  const isLoading = () => decisionState().isLoading.getDecisions;
  const hasError = () => decisionState().error !== null;
  const hasDecisions = () => decisionState().decisions.length > 0;

  return (
    <div class={styles.container} role="main" aria-label="Decision Dashboard">
      <Switch fallback={<EmptyState />}>
        {/* Loading State */}
        <Match when={isLoading()}>
          <LoadingState />
        </Match>

        {/* Error State */}
        <Match when={hasError()}>
          <ErrorState error={decisionState().error!} />
        </Match>

        {/* Success State */}
        <Match when={hasDecisions()}>
          <div
            class={styles.decisionsGrid}
            role="list"
            aria-label="Your decisions">
            <For each={decisionState().decisions}>
              {(decision, index) => (
                <div
                  role="listbox"
                  aria-setsize={decisionState().decisions.length}
                  aria-posinset={index() + 1}>
                  <DecisionCard decision={decision} />
                </div>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default DecisionDashboard;
