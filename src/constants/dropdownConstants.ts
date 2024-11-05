export const ROLE_OPTIONS = {
  MEMBER: "멤버",
  ADMIN: "어드민",
} as const;

export const ORDER_OPTIONS = {
  latest: "최신순",
  alphabetical: "가나다순",
  oldest: "오래된순",
} as const;

export type OrderType = keyof typeof ORDER_OPTIONS;
