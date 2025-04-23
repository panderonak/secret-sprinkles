export function getUserProfileUrl(username: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  return `${base}/u/${encodeURIComponent(username)}`;
}
