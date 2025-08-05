import { Component, createSignal, For } from "solid-js";
import DecisionCard from "../decision-card";
import styles from "./decision-dashboard.module.css";
import { Decision } from "../../types";

const DecisionDashboard: Component = () => {
  const [decisions, setDecisions] = createSignal<Decision[]>([]);

  const mockDecisions = Array(10)
    .fill(0)
    .map((_, i) => ({
      id: i.toString(),
      title: `Decision ${i + 1}`,
      completed: i % 3 === 0,
    }));

  setDecisions(mockDecisions);

  setTimeout(() => {
    setDecisions((prev) =>
      prev.map((decision, index) =>
        index === 0 ? { ...decision, title: "This should change" } : decision,
      ),
    );
  }, 1000);

  return (
    <div class={styles.container}>
      <For each={decisions()}>
        {(decision) => (
          <DecisionCard
            id={decision.id}
            title={decision.title}
            completed={decision.completed}
          />
        )}
      </For>
      {/* {JSON.stringify(decisions(), undefined, 2)} */}
    </div>
  );
};

export default DecisionDashboard;
