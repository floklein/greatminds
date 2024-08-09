import { createRootRoute, Outlet } from "@tanstack/react-router";
import { client } from "../colyseus";

export const Route = createRootRoute({
  component: () => (
    <>
      <h1>Wavelength</h1>
      <Outlet />
    </>
  ),
  beforeLoad: () => client.auth.signInAnonymously(),
});
