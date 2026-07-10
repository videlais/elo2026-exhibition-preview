import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { appRoutes } from "../components/routes/appRoutes";

// Vite injects the deploy sub-path as BASE_URL (e.g. "/mediaartsexhibits/elo2026/").
// BrowserRouter expects a basename without a trailing slash, falling back to "/".
const basename = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "") || "/";

const Index = () => {
  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <Suspense
        fallback={
          <div role="status" aria-live="polite" className="elcContainer">
            Loading…
          </div>
        }
      >
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default Index;
