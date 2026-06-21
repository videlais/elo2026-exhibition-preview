import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { appRoutes } from "../components/routes/appRoutes";

const Index = () => {
  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <HashRouter>
      <Suspense fallback={<div className="elcContainer">Loading...</div>}>
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </HashRouter>
  );
};
export default Index;