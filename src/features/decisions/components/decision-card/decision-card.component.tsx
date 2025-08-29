import { Component, Show } from "solid-js";
import { Decision } from "../../types";
import styles from "./decision-card.module.css";

const DecisionCard: Component<{ decision: Decision }> = (props) => {
  const decision = props.decision;

  const displayCompletedDate =
    decision.completedAt?.toDate().toLocaleDateString() ?? null;
  const displayCreatedDate = decision.createdAt.toDate().toLocaleDateString();

  return (
    <div
      class={styles.card}
      classList={{ [styles.completed]: decision.completedAt != null }}>
      <div class={styles.header}>{decision.title}</div>

      <div class={styles.body}></div>

      <div class={styles.footer}>
        <div class={styles.actions}></div>
        <div class={styles.displayDate}>
          <Show
            when={displayCompletedDate}
            fallback={<>created: {displayCreatedDate}</>}>
            completed: {displayCompletedDate}
          </Show>
        </div>
      </div>
    </div>
  );
};

export default DecisionCard;
