import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocsFromServer,
  query,
  where,
  type Firestore,
} from "firebase/firestore";

import { apiService, ApiService } from "../../api";
import { firestore } from "../../../configs";
import { fsPaths } from "../../../utils";
import { authService, AuthService } from "../../auth/services";
import { Decision } from "../types";

class DecisionService {
  #apiService;
  #authService;
  #firestore;

  constructor(
    apiService: ApiService,
    authService: AuthService,
    firestore: Firestore,
  ) {
    this.#apiService = apiService;
    this.#authService = authService;
    this.#firestore = firestore;
  }

  async getDecisionCards(): Promise<DocumentData & { id: string }[]> {
    const userId = this.#authService.currentUser?.uid;

    if (!userId) {
      throw new Error("User ID is not available. User must be authenticated.");
    }

    const decisionsCollectionRef = collection(
      this.#firestore,
      fsPaths.decision.doc(userId).decisions.path,
    );

    const decisionCardsSnapshot = await getDocsFromServer(
      decisionsCollectionRef,
    );
    return decisionCardsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  async deleteDecisions(decisionIds: string[]): Promise<void> {
    const userId = this.#authService.currentUser?.uid;

    if (!userId) {
      throw new Error("User ID is not available. User must be authenticated.");
    }

    await Promise.allSettled(
      decisionIds.map((id) => {
        const docRef = doc(
          this.#firestore,
          fsPaths.decision.doc(userId).decisions.doc(id).path,
        );
        return deleteDoc(docRef);
      }),
    );
  }
}

export const decisionService = new DecisionService(
  apiService,
  authService,
  firestore,
);
