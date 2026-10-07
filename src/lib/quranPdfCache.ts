/**
 * Offline Quran PDF Storage & Cache Manager
 * Uses Cache Storage API / IndexedDB for true offline-first performance
 */

export const QURAN_PDF_PATH = "/quran/quran.pdf";
export const QURAN_CACHE_NAME = "quran-offline-cache-v1";
export const STORAGE_KEY_CURRENT_POSITION = "daur_quran_current_reading_page";
export const STORAGE_KEY_LAST_SAVED_PROGRESS = "daur_quran_last_saved_progress_page";
export const STORAGE_KEY_LAST_SAVED_JUZ = "daur_quran_last_saved_juz";

/**
 * Check if the Quran PDF is already cached locally for offline use
 */
export async function isQuranPdfCached(): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }
  try {
    const cache = await caches.open(QURAN_CACHE_NAME);
    const match = await cache.match(QURAN_PDF_PATH);
    return !!match;
  } catch (err) {
    console.error("Failed to check Quran PDF cache:", err);
    return false;
  }
}

/**
 * Download and cache the Quran PDF locally for offline use
 */
export async function cacheQuranPdf(
  onProgress?: (percent: number) => void
): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }

  try {
    const response = await fetch(QURAN_PDF_PATH, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} fetching Quran PDF`);
    }

    const contentLength = response.headers.get("content-length");
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    if (totalBytes > 0 && response.body && onProgress) {
      const reader = response.body.getReader();
      let receivedBytes = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          onProgress(Math.min(100, Math.round((receivedBytes / totalBytes) * 100)));
        }
      }

      const blob = new Blob(chunks as BlobPart[], { type: "application/pdf" });
      const syntheticResponse = new Response(blob, {
        headers: { "Content-Type": "application/pdf" }
      });

      const cache = await caches.open(QURAN_CACHE_NAME);
      await cache.put(QURAN_PDF_PATH, syntheticResponse);
    } else {
      const cache = await caches.open(QURAN_CACHE_NAME);
      await cache.add(QURAN_PDF_PATH);
      if (onProgress) onProgress(100);
    }

    return true;
  } catch (err) {
    console.error("Failed to cache Quran PDF:", err);
    return false;
  }
}

/**
 * Get Blob URL for cached PDF (or fallback to URL)
 */
export async function getQuranPdfUrl(): Promise<string> {
  if (typeof window === "undefined") {
    return QURAN_PDF_PATH;
  }

  try {
    if ("caches" in window) {
      const cache = await caches.open(QURAN_CACHE_NAME);
      const match = await cache.match(QURAN_PDF_PATH);
      if (match) {
        const blob = await match.blob();
        return URL.createObjectURL(blob);
      }
    }
  } catch (err) {
    console.warn("Could not retrieve PDF from cache, using path directly:", err);
  }

  return QURAN_PDF_PATH;
}

/**
 * Clear cached Quran PDF from device storage
 */
export async function clearOfflineQuranPdf(): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }

  try {
    const cache = await caches.open(QURAN_CACHE_NAME);
    return await cache.delete(QURAN_PDF_PATH);
  } catch (err) {
    console.error("Failed to delete Quran PDF from cache:", err);
    return false;
  }
}

/**
 * Local Position (Where user stopped reading in PDF)
 */
export function getCurrentReadingPosition(): number {
  if (typeof window === "undefined") return 1;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_POSITION);
    return saved ? parseInt(saved, 10) || 1 : 1;
  } catch {
    return 1;
  }
}

export function setCurrentReadingPosition(page: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_POSITION, String(Math.max(1, Math.min(604, page))));
  } catch {}
}

/**
 * Official Saved Daur Progress (Confirmed by user)
 */
export function getLastSavedProgressPage(): number {
  if (typeof window === "undefined") return 1;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LAST_SAVED_PROGRESS);
    return saved ? parseInt(saved, 10) || 1 : 1;
  } catch {
    return 1;
  }
}

export function setLastSavedProgressPage(page: number, juz?: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_LAST_SAVED_PROGRESS, String(Math.max(1, Math.min(604, page))));
    if (juz) {
      localStorage.setItem(STORAGE_KEY_LAST_SAVED_JUZ, String(juz));
    }
  } catch {}
}

export function getLastSavedJuz(): number {
  if (typeof window === "undefined") return 1;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LAST_SAVED_JUZ);
    return saved ? parseInt(saved, 10) || 1 : 1;
  } catch {
    return 1;
  }
}
