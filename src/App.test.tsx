import { render } from "@testing-library/react";
import WebApp from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { withAppBase } from "./constants/routing";

test("renders without crashing", () => {
  window.history.replaceState({}, "", withAppBase("/"));
  const { container } = render(
    <ThemeProvider>
      <WebApp />
    </ThemeProvider>,
  );
  expect(container).toBeTruthy();
});
