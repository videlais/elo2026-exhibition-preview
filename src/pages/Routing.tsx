import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import useManualScrollRestoration from "../hooks/useManualScrollRestoration";
import { appRoutes } from "../components/routes/appRoutes";

const Index = () => {
  useManualScrollRestoration();

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