import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import type { ErrorBoundaryState } from "../types";
import { Button } from "./ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false });
    }
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen bg-cream flex items-center justify-center px-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-pure-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Error icon">
              😔
            </div>
            <h1 className="text-2xl font-bold text-slate-ink mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-creative-teal mb-6">
              We're sorry, but something unexpected happened. Please try one of
              the options below.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-blue-grey hover:text-slate-ink">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-3 bg-sepia-note rounded text-xs overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              {this.retryCount < this.maxRetries && (
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  size="md"
                  className="w-full"
                  aria-label={`Try again (${
                    this.maxRetries - this.retryCount
                  } attempts remaining)`}
                >
                  Try Again ({this.maxRetries - this.retryCount} left)
                </Button>
              )}
              <Button
                onClick={this.handleRefresh}
                variant="secondary"
                size="md"
                className="w-full"
                aria-label="Refresh the page"
              >
                Refresh Page
              </Button>
              <Button
                href="/"
                variant="ghost"
                size="md"
                className="w-full"
                aria-label="Go back to homepage"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
