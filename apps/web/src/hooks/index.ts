import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ROOM_ALLOW_RECONNECTION_TIMEOUT_SECONDS } from "@wavelength/api";

export function useReconnectionToken() {
  const [token, setToken] = useLocalStorage<string | null>(
    "reconnectionToken",
    null,
  );
  const [createdAt, setCreatedAt] = useLocalStorage<number | null>(
    "reconnectionTokenCreatedAt",
    null,
  );

  useEffect(() => {
    if (
      token !== null &&
      createdAt !== null &&
      Date.now() - createdAt > ROOM_ALLOW_RECONNECTION_TIMEOUT_SECONDS * 1000
    ) {
      setToken(null);
      setCreatedAt(null);
    }
  }, [token, createdAt]);

  function setReconnectionToken(newToken: string | null) {
    setToken(newToken);
    setCreatedAt(newToken ? Date.now() : null);
  }

  return [token, setReconnectionToken] as const;
}
