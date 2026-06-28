/**
 * Placeholder. Replace by running:
 *   npx supabase gen types typescript --project-id <id> --schema public > lib/types/database.ts
 * after the migrations in supabase/migrations have been applied.
 *
 * Until then, table rows are untyped (Record<string, any>) so the Supabase
 * client compiles without forcing every query result to `never`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export type Database = {
  public: {
    Tables: Record<
      string,
      { Row: AnyRecord; Insert: AnyRecord; Update: AnyRecord; Relationships: never[] }
    >;
    Views: Record<string, { Row: AnyRecord; Relationships: never[] }>;
    Functions: Record<string, { Args: AnyRecord; Returns: AnyRecord }>;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, AnyRecord>;
  };
};
