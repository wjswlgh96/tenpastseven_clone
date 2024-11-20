import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";
import mapSupabaseError from "./errorMessage";

export const handleSupabaseError = (
  error: AuthError | PostgrestError | StorageError | null | undefined
) => {
  const message = mapSupabaseError(error);
  throw new Error(message);
};
