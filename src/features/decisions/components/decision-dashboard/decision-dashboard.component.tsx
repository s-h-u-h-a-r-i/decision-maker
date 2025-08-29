import { Component, createSignal, For, Match, Switch } from "solid-js";

import { Decision } from "../../types";
import { useDecision } from "../../store";
import DecisionCard from "../decision-card";
import styles from "./decision-dashboard.module.css";

const DecisionDashboard: Component = () => {
  const decisionStore = useDecision();
  const decisionState = decisionStore.state;

  const decisionsExist = () => decisionState().decisions.length > 0;
  const decisionStateHasError = () => decisionState().error !== null;

  return (
    <div class={styles.container}>
      <Switch fallback={<div>No Decisions Found, Create Decision</div>}>
        {/* Loading State */}
        <Match when={decisionState().isLoading.getDecisions}>
          <div>Loading...</div>
        </Match>

        {/* Error State */}
        <Match when={decisionStateHasError()}>
          <div>error occurred: {decisionState().error}</div>
        </Match>

        {/* Success State */}
        <Match when={decisionsExist()}>
          <For each={decisionState().decisions}>
            {(decision) => <DecisionCard decision={decision} />}
          </For>
        </Match>
      </Switch>
    </div>
  );
};

export default DecisionDashboard;
