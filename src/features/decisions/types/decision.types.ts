import { Timestamp } from "firebase/firestore";

export interface Decision extends Record<string, unknown> {
  id: string;
  createdAt: Timestamp;
  title: string;
  completedAt: Timestamp | null;
}
