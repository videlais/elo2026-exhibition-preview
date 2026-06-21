import React from "react";
import { Button } from "react-bootstrap";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 text-center">
          <h1>Something went wrong</h1>
          <p>The application encountered an unexpected error. Please try refreshing the page.</p>
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-3 text-start">
              <summary>Error Details</summary>
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {this.state.error.message}
                {"\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
