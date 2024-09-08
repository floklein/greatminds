import { useLocalStorage } from "usehooks-ts";

export function useReconnectionToken() {
  const [token, setToken] = useLocalStorage<string | null>(
    "reconnectionToken",
    null,
  );

  return [token, setToken] as const;
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>("isAdmin", false);

  return [isAdmin, setIsAdmin] as const;
}
