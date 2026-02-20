// ─────────────────────────────────────────────────────────────
// Shared Types — ShahdCoop
// ─────────────────────────────────────────────────────────────

// ─── Auth & Roles ─────────────────────────────────────────────
export type Role = "customer" | "member" | "admin";

// ─── Order ───────────────────────────────────────────────────
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

// ─── 2FA ─────────────────────────────────────────────────────
export interface BackupCode {
  code: string;
  usedAt?: Date;
}

// ─── API Helpers ──────────────────────────────────────────────
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

// ─── Locale ───────────────────────────────────────────────────
export type Locale = "fr" | "ar" | "en";

export interface LocalizedString {
  fr: string;
  ar: string;
  en: string;
}
