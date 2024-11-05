import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";

import { type Schema } from "../../../../amplify/data/resource";
import outputs from "../../../../amplify_outputs.json";

Amplify.configure(outputs);

export type AmplifyResponseType<T> = {
  data: T;
  errors?: {
    message: string;
    // path?: string;
    code?: string;
    // field?: string;
    // location: "input" | "query" | "mutation" | "subscription";
    [key: string]: unknown;
  }[];
};

export const generateAmplifyClient = () => generateClient<Schema>();

export const client = generateAmplifyClient();

export type User = Schema["User"]["type"];
export type Team = Schema["Team"]["type"];
export type Resource = Schema["Resource"]["type"];
export type Reservation = Schema["Reservation"]["type"];

export type Role = Schema["User"]["type"]["role"];

export const RESOURCE_TYPE = client.enums.ResourceType.values();
export type ResourceType = Schema["Resource"]["type"]["resourceType"];

export const RESERVATION_STATUS = client.enums.ReservationStatus.values();
export type ReservationStatus = (typeof RESERVATION_STATUS)[number];
