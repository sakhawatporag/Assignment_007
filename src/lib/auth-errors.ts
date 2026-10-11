type AuthError = {
  code?: string;
};

function getErrorCode(error: unknown) {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  return (error as AuthError).code;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  const messages: Record<string, string> = {
    INVALID_EMAIL_OR_PASSWORD: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।',
    USER_ALREADY_EXISTS: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে।',
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
      'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। অন্য ইমেইল ব্যবহার করুন।',
    PASSWORD_TOO_SHORT: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
    INVALID_EMAIL: 'সঠিক ইমেইল ঠিকানা লিখুন।',
    INVALID_ORIGIN: 'এই ঠিকানা থেকে অনুরোধটি গ্রহণ করা যাচ্ছে না।',
    SOCIAL_PROVIDER_NOT_FOUND: 'এই সামাজিক লগইনটি বর্তমানে চালু নেই।',
  };

  const code = getErrorCode(error);
  return (code && messages[code]) || fallback;
}
