import { PostgrestError, AuthError } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";
export default function mapSupabaseError(
  error: AuthError | PostgrestError | StorageError | null | undefined
): string {
  if (!error)
    return "예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  if (error instanceof StorageError) {
    return error.message;
  }

  const errorMapping: Record<string, string> = {
    "22P02": "잘못된 입력 형식입니다. 값을 확인해주세요.",
    "23505": "이미 존재하는 데이터입니다. 다른 값을 입력해주세요.",
    "23503": "관련된 데이터가 없어 작업을 완료할 수 없습니다.",
    "42501": "권한이 없습니다. 관리자에게 문의해주세요.",
    invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  };

  const code = (error as AuthError | PostgrestError).code;
  const message =
    errorMapping[code as keyof typeof errorMapping] ||
    "예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  console.error(`Supabase Error: [${code}]: ${error.message}`);

  return message;
}
