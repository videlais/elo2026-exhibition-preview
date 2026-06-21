import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/app.scss";
import "@fontsource/exo"; // Defaults to weight 400
import FoutStager from "react-fout-stager";
import { ThemeProvider } from "./context/ThemeContext";

const FoutStagerComponent =
  (FoutStager as unknown as { default?: typeof FoutStager }).default ?? FoutStager;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <FoutStagerComponent stages={[{
        className: "font-stage-primary",
        families: [
          { family: "Exo" },
          { family: "Open Sans" },
        ],
        stages: [{
          className: "font-stage-secondary",
          families: [
            { family: "Exo", options: { weight: "200" } },
            { family: "Open Sans", options: { weight: "300" } },
          ],
        }],
      }]}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </FoutStagerComponent>
    </ErrorBoundary>
  </React.StrictMode>,
);
