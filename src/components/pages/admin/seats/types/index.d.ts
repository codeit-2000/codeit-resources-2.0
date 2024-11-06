export interface SeatData {
  name: string;
  status: "fixed" | "enable" | "disabled" | "confirmed";
  participant?: string;
}

export interface FormValue {
  seatStatus: "fixed" | "enable" | "disabled";
  participant?: string;
}
