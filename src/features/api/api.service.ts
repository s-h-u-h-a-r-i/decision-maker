import { env } from "../../configs";

class ApiService {
  #baseUrl = env.baseApiUrl;
}

export const apiService = new ApiService();
export type { ApiService };
