let _backendUrl: string = "http://localhost:8000";

if (typeof window !== "undefined") {
  const runtimeUrl = (window as any).__BACKEND_URL__;
  if (runtimeUrl) {
    _backendUrl = runtimeUrl;
  }
}

export const BACKEND_URL = _backendUrl;