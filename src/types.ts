import { Timestamp } from "firebase/firestore";

export interface Gift {
  id?: string;
  name: string;
  value: number | string;
  category: string;
  imageURL: string;
  iconURL: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}