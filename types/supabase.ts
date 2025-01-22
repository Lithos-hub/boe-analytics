import type { Boe } from "~/models/boe"

export type Database = {
  public: {
    Tables: {
      boes: {
        Row: Boe
        Insert: Omit<Boe, 'id'>
        Update: Partial<Omit<Boe, 'id'>>
      }
    }
  }
} 