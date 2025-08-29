import {
  createContext,
  createSignal,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

import { Decision } from "../types";
import { decisionService } from "../services";
import { DocumentData, Timestamp } from "firebase/firestore";
import {
  isNonEmptyString,
  validateObject,
  ValidateSchema,
} from "../../../utils";

interface DecisionLoadingStates {
  getDecisions: boolean;
}

interface DecisionState {
  decisions: Decision[];
  error: string | null;
  isLoading: DecisionLoadingStates;
}

interface DecisionContextvalue {
  state(): DecisionState;
}

const DecisionContext = createContext<DecisionContextvalue>();

export const DecisionProvider: ParentComponent = (props) => {
  const [decisions, setDecisions] = createStore<Decision[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal<DecisionLoadingStates>({
    getDecisions: false,
  });

  const state = (): DecisionState => ({
    decisions,
    error: error(),
    isLoading: isLoading(),
  });

  const _prepareRequest = (loadingKey: keyof DecisionLoadingStates) => {
    setIsLoading((prev) => ({ ...prev, [loadingKey]: true }));
    setError(null);
  };

  const _validateDecisions = async (
    decisions: DocumentData & { id: string }[],
  ) => {
    const validDecisions: Decision[] = [];
    const invalidDecisionIds: string[] = [];

    const validateDecision = (decision: DocumentData & { id: string }) => {
      const isTimestamp = (time: unknown): time is Timestamp => {
        return time instanceof Timestamp;
      };

      const normalizedDecision = {
        ...decision,
        completedAt:
          decision.completedAt === undefined ? null : decision.completedAt,
      };

      const decisionSchema: ValidateSchema<Decision> = {
        id: {
          predicate: (val) => isNonEmptyString(val),
          errorMsg: "id must be a non-empty string",
        },
        createdAt: {
          predicate: (val) => isTimestamp(val),
          errorMsg: "createdAt must be a Timestamp",
        },
        ownerId: {
          predicate: (val) => isNonEmptyString(val),
          errorMsg: "ownerId must be a non-empty string",
        },
        title: {
          predicate: (val) => isNonEmptyString(val),
          errorMsg: "title must be a non-empty string",
        },
        completedAt: {
          predicate: (val) => val === null || isTimestamp(val),
          errorMsg: "completedAt must be a Timestamp or null",
        },
      };

      const validateResult = validateObject(
        normalizedDecision,
        decisionSchema,
        false,
      );

      if (!validateResult.success) {
        invalidDecisionIds.push(decision.id);
        return;
      }

      validDecisions.push(validateResult.data);
    };

    decisions.forEach(validateDecision);

    if (invalidDecisionIds.length) {
      await decisionService.deleteDecisions(invalidDecisionIds);
    }

    return validDecisions;
  };

  const getDecisions = async () => {
    try {
      _prepareRequest("getDecisions");
      const dbDecisions = await decisionService.getDecisionCards();
      const validatedDecisions = await _validateDecisions(dbDecisions);
      setDecisions(validatedDecisions);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching decisions",
      );
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, getDecisions: false }));
    }
  };

  onMount(getDecisions);

  const contextValue: DecisionContextvalue = {
    state,
  };

  return (
    <DecisionContext.Provider value={contextValue}>
      {props.children}
    </DecisionContext.Provider>
  );
};

export const useDecision = (): DecisionContextvalue => {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error("useDecision must be used within a DecisionProvider");
  }
  return context;
};
