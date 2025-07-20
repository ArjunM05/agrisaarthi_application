// Central place for backend API base path
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://agrosaarthi-backend-ws-18-8000.ml.iit-ropar.truefoundry.cloud";

// Optionally, a helper to get auth headers (if you use JWT or session tokens)
// Usage: const headers = useApiAuthHeaders();
import { useAuth } from "./AuthProvider";

export function useApiAuthHeaders() {
  useAuth(); // Call to ensure hook is used, but don't destructure unused values
  // If you use JWT or session tokens, add them here
  // Example: return { Authorization: `Bearer ${user?.token}` };
  // For now, just return empty headers
  return {};
}
