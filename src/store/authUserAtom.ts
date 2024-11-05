import type { Schema } from "@amplify/data/resource";
import { atomWithStorage } from "jotai/utils";

type User = Schema["User"]["type"];

/**
 * 로그인 여부 Atom
 */
export const authAtom = atomWithStorage<boolean | null>(
  "isAuthenticated",
  null,
);

/**
 * 유저 정보 Atom
 */
export const userAtom = atomWithStorage<User | null>("user", null);

/**
 * ADMIN 여부 Atom
 */
export const adminAtom = atomWithStorage<boolean | null>("isAdmin", null);
