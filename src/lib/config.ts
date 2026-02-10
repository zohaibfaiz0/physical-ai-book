let _backendUrl: string = "https://zohaib009-new-book-backend.hf.space";

if (typeof window !== "undefined") {
  const runtimeUrl = (window as any).__BACKEND_URL__;
  if (runtimeUrl) {
    _backendUrl = runtimeUrl;
  }
}

export const BACKEND_URL = _backendUrl;
