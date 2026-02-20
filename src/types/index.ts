// ─────────────────────────────────────────────
// Shared Types — ShahdCoop
// ─────────────────────────────────────────────

export type Role = "customer" | "member" | "admin";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "stripe" | "cod";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
