import { apiService, ApiService } from "../../api";

class DecisionService {
  #apiService: ApiService;

  constructor(apiService: ApiService) {
    this.#apiService = apiService;
  }
}

export const decisionService = new DecisionService(apiService);
