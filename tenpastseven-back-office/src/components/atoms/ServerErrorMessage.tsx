"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ServerErrorMessage({
  error,
}: {
  error: string | null;
}) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return null;
}
