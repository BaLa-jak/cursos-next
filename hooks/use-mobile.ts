import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// `useSyncExternalStore` is the canonical way to subscribe to a browser
// API from React. It gives us:
//
//   • A stable SSR/initial-hydration snapshot (returns `false` for every
//     request, regardless of the actual device), which prevents the
//     hydration mismatch we'd otherwise get by reading `window.innerWidth`
//     during render.
//
//   • A live subscription to `matchMedia("change")` so the component
//     re-renders when the user resizes the window or rotates the device.
//
//   • No `useState` + `useEffect` dance, which avoids the cascading render
//     that the `react-hooks/set-state-in-effect` rule flags.
function getSnapshot(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot(): boolean {
  // Assume desktop during SSR / initial hydration. The client snapshot
  // takes over on the first paint after hydration.
  return false;
}

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useIsMobile(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
