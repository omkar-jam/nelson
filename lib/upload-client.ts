/** XMLHttpRequest gives upload progress; fetch() does not. */

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function postFormWithUploadProgress(
  path: string,
  formData: FormData,
  onProgress: (loaded: number, total: number | null) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', path);
    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (ev) => {
      if (ev.lengthComputable) {
        onProgress(ev.loaded, ev.total);
      } else {
        onProgress(ev.loaded, null);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { url?: string; error?: string };
          if (data.url) resolve({ url: data.url });
          else reject(new Error(data.error || 'Upload failed'));
        } catch {
          reject(new Error('Invalid server response'));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText) as { error?: string };
          reject(new Error(data.error || xhr.statusText || 'Upload failed'));
        } catch {
          reject(new Error(xhr.statusText || 'Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error — check your connection')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
    xhr.send(formData);
  });
}
