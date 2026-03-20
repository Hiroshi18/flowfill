export type BackendUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  studio_id?: number | null;
  credits_balance: number;
  membership_type?: string | null;
  age?: number | null;
  joined_date?: string | null;
};

export type BackendStudio = {
  id: number;
  name: string;
  style?: string | null;
  address?: string | null;
  description?: string | null;
  price_per_class_eur?: number | null;
  default_capacity?: number | null;
  rating?: number | null;
  owner_user_id?: number | null;
  // FIXED: Added coordinates for the globe component
  latitude?: number | null;
  longitude?: number | null;
};

export type BackendClassInstance = {
  id: number;
  schedule_id?: number | null;
  studio_id: number;
  date: string; // YYYY-MM-DD
  day_of_week: number;
  time?: string | null; // HH:MM
  class_type?: string | null;
  instructor?: string | null;
  capacity?: number | null;
  bookings_count?: number | null;
  waitlist_count?: number | null;
  occupancy_rate?: number | null;
  price_eur?: number | null;
  status: string;
};

export type BackendBooking = {
  id: number;
  user_id: number;
  instance_id: number;
  studio_id: number;
  class_type?: string | null;
  class_date: string; // YYYY-MM-DD
  class_time?: string | null; // HH:MM
  day_of_week?: number | null;
  status: "confirmed" | "waitlist" | "cancelled" | string;
  attended?: boolean | null;
  credits_used: number;
  price_paid_eur?: number | null;
  booked_at: string;
};

export type BackendCreditTxn = {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  reason?: string | null;
  source_instance_id?: number
