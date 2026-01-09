import { Component } from "react";
import PropTypes from "prop-types";
import { logComponentError } from "../utils/errorLogger";

/**
 * Error Boundary component for catching and handling React errors
 * Prevents entire app from crashing when a component error occurs
 * Provides fallback UI and error recovery options
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  /**
   * Update state when an error is caught
   * This lifecycle is called during the "render" phase
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details after error is caught
   * This lifecycle is called during the "commit" phase
   */
  componentDidCatch(error, errorInfo) {
    const { componentName, onError } = this.props;

    // Log to error service
    logComponentError(componentName || "Unknown Component", error, errorInfo);

    // Update state with error info
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  /**
   * Reset error boundary state to retry rendering
   */
  handleReset = () => {
    const { onReset } = this.props;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call custom reset handler if provided
    if (onReset) {
      onReset();
    }
  };

  /**
   * Reload the entire page (last resort)
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Render fallback UI when error occurs
   */
  renderFallback() {
    const { error, errorInfo, errorCount } = this.state;
    const { fallback, showDetails, componentName } = this.props;

    // Use custom fallback if provided
    if (fallback) {
      return fallback(error, errorInfo, this.handleReset);
    }

    // Default fallback UI
    const isDevelopment =
      typeof import.meta !== "undefined"
        ? import.meta.env.MODE === "development"
        : true;
    const showErrorDetails = showDetails || isDevelopment;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--color-bg-base, #1a1a2e)",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "2rem",
            borderRadius: "1rem",
            background: "var(--color-panel-base, #16213e)",
            border: "1px solid var(--color-border-default, #0f3460)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e94560 0%, #c93a52 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            ⚠️
          </div>

          {/* Error Title */}
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "0.75rem",
              color: "var(--color-text-primary, #ffffff)",
            }}
          >
            Oops! Something went wrong
          </h2>

          {/* Error Description */}
          <p
            style={{
              fontSize: "0.95rem",
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "var(--color-text-secondary, #b8b8d1)",
              lineHeight: "1.6",
            }}
          >
            {componentName
              ? `An error occurred in the ${componentName} component.`
              : "An unexpected error occurred in the application."}
            {errorCount > 1 && ` (${errorCount} errors)`}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: showErrorDetails ? "1.5rem" : "0",
            }}
          >
            <button
              onClick={this.handleReset}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, var(--color-felt-light, #1a7360) 0%, var(--color-felt-base, #145a4a) 100%)",
                color: "#ffffff",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(26, 115, 96, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Try Again
            </button>

            <button
              onClick={this.handleReload}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border-default, #0f3460)",
                cursor: "pointer",
                background: "transparent",
                color: "var(--color-text-primary, #ffffff)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--color-panel-dark, #0f1729)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              Reload Page
            </button>
          </div>

          {/* Error Details (Development Only) */}
          {showErrorDetails && error && (
            <details
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                borderRadius: "0.5rem",
                background: "var(--color-panel-dark, #0f1729)",
                border: "1px solid var(--color-border-subtle, #1a2744)",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--color-text-gold, #c9a227)",
                  marginBottom: "0.75rem",
                }}
              >
                Error Details
              </summary>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-text-muted, #8892ab)",
                  fontFamily: "monospace",
                }}
              >
                <div style={{ marginBottom: "0.75rem" }}>
                  <strong
                    style={{ color: "var(--color-text-primary, #ffffff)" }}
                  >
                    Error:
                  </strong>
                  <pre
                    style={{
                      marginTop: "0.25rem",
                      padding: "0.5rem",
                      background: "rgba(0, 0, 0, 0.3)",
                      borderRadius: "0.25rem",
                      overflow: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {error.toString()}
                  </pre>
                </div>

                {error.stack && (
                  <div>
                    <strong
                      style={{ color: "var(--color-text-primary, #ffffff)" }}
                    >
                      Stack Trace:
                    </strong>
                    <pre
                      style={{
                        marginTop: "0.25rem",
                        padding: "0.5rem",
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "0.25rem",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxHeight: "200px",
                      }}
                    >
                      {error.stack}
                    </pre>
                  </div>
                )}

                {errorInfo?.componentStack && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <strong
                      style={{ color: "var(--color-text-primary, #ffffff)" }}
                    >
                      Component Stack:
                    </strong>
                    <pre
                      style={{
                        marginTop: "0.25rem",
                        padding: "0.5rem",
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "0.25rem",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxHeight: "150px",
                      }}
                    >
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return this.renderFallback();
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  componentName: PropTypes.string,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  showDetails: PropTypes.bool,
};

export default ErrorBoundary;
