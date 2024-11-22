"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import mapSupabaseError from "../supabase/errorMessage";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => toast.error(mapSupabaseError(error)),
  }),
  mutationCache: new MutationCache({
    onError: (error) => toast.error(mapSupabaseError(error)),
  }),
});

export default function TanStackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
