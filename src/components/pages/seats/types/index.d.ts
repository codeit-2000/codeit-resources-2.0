export interface SeatData {
  name: string;
  status: "fixed" | "enable" | "confirmed" | "disabled";
  participant?: string;
}
