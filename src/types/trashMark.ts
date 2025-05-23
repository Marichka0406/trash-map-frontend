
import type { User } from "../types/auth";
export type TrashStatus = "collected" | "not collected";

export interface Location {
  type: "Point";
  coordinates: [number, number]; 
}

export interface TrashMarkHistoryEntry {
  updatedBy: string;
  status: TrashStatus;
  description: string;
  photos: string[];
  updatedAt: string;
}

export interface TrashMarkRequest {
  description: string;
  location: Location;
  photos: string[]; 
  status: TrashStatus;
}

export interface СreateTrashMarkResponse {
  _id: string;
  location: Location;
  status: TrashStatus;
}

export interface GetTrashMarkResponse {
  _id: string;
  description: string;
  location: Location;
  photos: string[];
  status: TrashStatus;
  createdBy: User;
  updatedBy: User;
  trashMarkHistory: TrashMarkHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface MapTrashMark {
  _id: string;
  status: TrashStatus;
  location: Location;
}
