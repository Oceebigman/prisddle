const cache = new Map<string, { value: any; expiry: number }>();

export async function getCached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.value as T;
  }

  const result = await fetcher();
  cache.set(key, {
    value: result,
    expiry: Date.now() + ttlSeconds * 1000,
  });
  return result;
}
