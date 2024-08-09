import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <h1>Wavelength</h1>
      <Outlet />
    </>
  ),
});
