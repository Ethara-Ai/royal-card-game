import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { GiSpadeSkull, GiHearts, GiDiamonds, GiClubs } from "react-icons/gi";

const AceOfSpadesCard = ({ className, style, theme }) => (
  <div
    className={className}
    style={{
      ...style,
      background:
        theme === "light"
          ? "linear-gradient(145deg, #ffffff 0%, #f5f5f0 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #f8f8f8 100%)",
      border:
        theme === "light"
          ? "1px solid var(--color-card-border)"
          : "1px solid var(--color-card-border)",
      borderRadius: "6px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2px",
      padding: "8px 6px",
      boxShadow:
        theme === "light"
          ? "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
          : "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    {/* Subtle card texture overlay */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(0,0,0,0.02) 100%)",
        pointerEvents: "none",
      }}
    />

    {/* Rank - A */}
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "20px",
        fontWeight: 700,
        lineHeight: 1,
        color: "var(--color-card-black)",
        textShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
        zIndex: 1,
      }}
    >
      A
    </div>

    {/* Spade Icon */}
    <div
      style={{
        fontSize: "32px",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-card-black)",
        filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15))",
        zIndex: 1,
      }}
    >
      <GiSpadeSkull />
    </div>
  </div>
);

AceOfSpadesCard.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.string,
};

const LoadingScreen = ({
  isLoading,
  onLoadingComplete,
  minDisplayTime = 2000,
  theme = "dark",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    const duration = minDisplayTime;
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;

      // Add some randomness to make it feel more natural
      const jitter = Math.random() * 2 - 1;
      const newProgress = Math.min(currentProgress + jitter, 100);

      setProgress(newProgress);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [minDisplayTime]);

  useEffect(() => {
    if (!isLoading && progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 600);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isLoading, progress, onLoadingComplete]);

  if (!isVisible) return null;

  const isLightTheme = theme === "light";

  return (
    <div
      className={`loading-screen ${isFadingOut ? "loading-fade-out" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: isLightTheme
          ? "radial-gradient(ellipse at top, var(--color-bg-surface) 0%, var(--color-bg-base) 50%, var(--color-bg-deep) 100%)"
          : "radial-gradient(ellipse at top, var(--color-bg-surface) 0%, var(--color-bg-base) 50%, var(--color-bg-deep) 100%)",
        overflow: "hidden",
      }}
    >
      {/* Soft radial spotlight */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)",
          height: "min(600px, 90vw)",
          background: isLightTheme
            ? "radial-gradient(ellipse at center, rgba(139, 90, 32, 0.2) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(201, 162, 39, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Animated card suits container */}
      <div
        className="suits-container"
        style={{
          position: "relative",
          width: "200px",
          height: "200px",
          marginBottom: "var(--space-8)",
        }}
      >
        {/* Center glow */}
        <div
          className="center-glow"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100px",
            height: "100px",
            borderRadius: "var(--radius-full)",
            background: isLightTheme
              ? "radial-gradient(ellipse at center, rgba(139, 90, 32, 0.35) 0%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(201, 162, 39, 0.4) 0%, transparent 70%)",
            filter: "blur(16px)",
          }}
        />

        {/* Card suits orbiting */}
        <div className="suit-orbit suit-orbit-1">
          <GiSpadeSkull
            className="suit-icon"
            style={{ color: "var(--color-text-primary)" }}
          />
        </div>
        <div className="suit-orbit suit-orbit-2">
          <GiHearts
            className="suit-icon"
            style={{ color: "var(--color-card-red)" }}
          />
        </div>
        <div className="suit-orbit suit-orbit-3">
          <GiClubs
            className="suit-icon"
            style={{ color: "var(--color-text-primary)" }}
          />
        </div>
        <div className="suit-orbit suit-orbit-4">
          <GiDiamonds
            className="suit-icon"
            style={{ color: "var(--color-card-red)" }}
          />
        </div>

        {/* Ace of Spades card stack in center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="card-stack">
            <AceOfSpadesCard
              className="stacked-card stacked-card-1"
              style={{ position: "absolute", width: "64px", height: "90px" }}
              theme={theme}
            />
            <AceOfSpadesCard
              className="stacked-card stacked-card-2"
              style={{ position: "absolute", width: "64px", height: "90px" }}
              theme={theme}
            />
            <AceOfSpadesCard
              className="stacked-card stacked-card-3"
              style={{ position: "absolute", width: "64px", height: "90px" }}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Loading text with better visibility */}
      <div
        className="loading-text-container"
        style={{
          background: isLightTheme
            ? "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)"
            : "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
          padding: "var(--space-4) var(--space-6)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border-gold)",
          boxShadow: isLightTheme
            ? "var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
            : "var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(8px)",
          textAlign: "center",
          minWidth: "220px",
        }}
      >
        <div
          className="loading-text game-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontWeight: 600,
            color: "var(--color-text-gold)",
            letterSpacing: "0.05em",
            textShadow: isLightTheme
              ? "0 1px 2px rgba(0, 0, 0, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(201, 162, 39, 0.4)",
            marginBottom: "var(--space-2)",
          }}
        >
          Shuffling the deck
          <span className="loading-dots">
            <span className="dot dot-1">.</span>
            <span className="dot dot-2">.</span>
            <span className="dot dot-3">.</span>
          </span>
        </div>

        {/* Subtle tagline with better visibility */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            color: "var(--color-text-secondary)",
            letterSpacing: "0.02em",
            textShadow: isLightTheme ? "none" : "0 1px 4px rgba(0, 0, 0, 0.4)",
            marginBottom: "var(--space-4)",
          }}
        >
          Preparing your table
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            background: isLightTheme
              ? "rgba(0, 0, 0, 0.15)"
              : "rgba(255, 255, 255, 0.15)",
            borderRadius: "var(--radius-full)",
            overflow: "hidden",
            marginBottom: "var(--space-2)",
          }}
        >
          <div
            className="progress-bar-fill"
            style={{
              height: "100%",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--color-gold-dark) 0%, var(--color-gold-base) 100%)",
              borderRadius: "var(--radius-full)",
              transition: "width 0.1s ease-out",
              boxShadow: "var(--shadow-glow-gold)",
            }}
          />
        </div>

        {/* Progress percentage */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-text-gold)",
            letterSpacing: "0.05em",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Gold accent line */}
      <div
        className="accent-line"
        style={{
          marginTop: "var(--space-6)",
          width: "120px",
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-gold-base) 50%, transparent 100%)",
          borderRadius: "var(--radius-full)",
          boxShadow: "var(--shadow-glow-gold)",
        }}
      />

      <style>{`
        .loading-screen {
          opacity: 1;
          transition: opacity 600ms ease-out;
        }

        .loading-fade-out {
          opacity: 0;
        }

        .suit-orbit {
          position: absolute;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .suit-icon {
          font-size: 24px;
          filter: drop-shadow(0 0 6px rgba(201, 162, 39, 0.25));
          animation: suit-pulse 3s ease-in-out infinite;
        }

        .suit-orbit-1 {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          animation: float-1 4s ease-in-out infinite;
        }

        .suit-orbit-2 {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          animation: float-2 4s ease-in-out infinite;
        }

        .suit-orbit-3 {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          animation: float-3 4s ease-in-out infinite;
        }

        .suit-orbit-4 {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          animation: float-4 4s ease-in-out infinite;
        }

        @keyframes float-1 {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          50% { transform: translateX(-50%) translateY(-6px); opacity: 1; }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(-50%) translateX(0); opacity: 0.7; }
          50% { transform: translateY(-50%) translateX(6px); opacity: 1; }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          50% { transform: translateX(-50%) translateY(6px); opacity: 1; }
        }

        @keyframes float-4 {
          0%, 100% { transform: translateY(-50%) translateX(0); opacity: 0.7; }
          50% { transform: translateY(-50%) translateX(-6px); opacity: 1; }
        }

        @keyframes suit-pulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(201, 162, 39, 0.2)); }
          50% { filter: drop-shadow(0 0 12px rgba(201, 162, 39, 0.4)); }
        }

        .card-stack {
          position: relative;
          width: 64px;
          height: 90px;
        }

        .stacked-card {
          transition: transform 0.3s ease;
        }

        .stacked-card-1 {
          transform: rotate(-5deg) translateX(-4px);
          animation: card-shuffle-1 3s ease-in-out infinite;
          opacity: 0.9;
        }

        .stacked-card-2 {
          transform: rotate(3deg) translateX(4px);
          animation: card-shuffle-2 3s ease-in-out infinite;
          opacity: 0.95;
        }

        .stacked-card-3 {
          transform: rotate(0deg);
          animation: card-shuffle-3 3s ease-in-out infinite;
        }

        @keyframes card-shuffle-1 {
          0%, 100% { transform: rotate(-5deg) translateX(-4px) translateY(0); }
          33% { transform: rotate(-7deg) translateX(-6px) translateY(-2px); }
          66% { transform: rotate(-3deg) translateX(-2px) translateY(2px); }
        }

        @keyframes card-shuffle-2 {
          0%, 100% { transform: rotate(3deg) translateX(4px) translateY(0); }
          33% { transform: rotate(5deg) translateX(6px) translateY(2px); }
          66% { transform: rotate(1deg) translateX(2px) translateY(-2px); }
        }

        @keyframes card-shuffle-3 {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          33% { transform: rotate(1deg) translateY(-1px); }
          66% { transform: rotate(-1deg) translateY(1px); }
        }

        .center-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.15); }
        }

        .loading-dots {
          display: inline-block;
          margin-left: 2px;
        }

        .dot {
          opacity: 0;
          animation: dot-fade 1.5s ease-in-out infinite;
        }

        .dot-1 { animation-delay: 0s; }
        .dot-2 { animation-delay: 0.3s; }
        .dot-3 { animation-delay: 0.6s; }

        @keyframes dot-fade {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .accent-line {
          animation: line-glow 3s ease-in-out infinite;
        }

        @keyframes line-glow {
          0%, 100% { opacity: 0.6; width: 120px; }
          50% { opacity: 1; width: 140px; }
        }

        .loading-text-container {
          animation: container-pulse 4s ease-in-out infinite;
        }

        @keyframes container-pulse {
          0%, 100% { box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.05), var(--shadow-glow-gold); }
          50% { box-shadow: var(--shadow-xl), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 30px rgba(201, 162, 39, 0.3); }
        }

        .progress-bar-fill {
          animation: progress-glow 2s ease-in-out infinite;
        }

        @keyframes progress-glow {
          0%, 100% { box-shadow: var(--shadow-glow-gold); }
          50% { box-shadow: 0 0 18px rgba(201, 162, 39, 0.6); }
        }
      `}</style>
    </div>
  );
};

LoadingScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onLoadingComplete: PropTypes.func,
  minDisplayTime: PropTypes.number,
  theme: PropTypes.string,
};

export default LoadingScreen;
