import { Component } from "solid-js";
import { Decision } from "../../types";
import styles from "./decision-card.module.css";

const DecisionCard: Component<Decision> = (decision) => {
  return (
    <div
      class={styles.card}
      classList={{ [styles.completed]: decision.completed }}>
      <div class={styles.header}>{decision.title}</div>
    </div>
  );
};

export default DecisionCard;
