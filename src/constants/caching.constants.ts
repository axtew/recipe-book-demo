/**
 * How long data from useQuery counts as fresh.
 */
export const STALE_TIME = 1000 * 60;

/**
 * Lifetime of the data, both in memory and in the on-disk snapshot.
 */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

/**
 * Version of the persisted data shape — not the app version.
 *
 * Bump when entities that land in the cache change: a snapshot of the old shape
 * is discarded as a whole instead of being hydrated into new code and breaking
 * the screen on a missing field.
 *
 * Do not tie it to the build version or hash: deploys go out on every push, and then
 * the offline cache would be wiped every time — exactly what it exists to avoid.
 */
export const CACHE_BUSTER = "v3";
