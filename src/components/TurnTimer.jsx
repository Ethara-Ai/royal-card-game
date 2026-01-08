import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";

const TURN_DURATION = 30;

const TurnTimer = ({ isActive, onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const intervalRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      hasTriggeredRef.current = false;
      setTimeLeft(TURN_DURATION);
      
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            if (!hasTriggeredRef.current) {
              hasTriggeredRef.current = true;
              setTimeout(() => onTimeUp(), 0);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
      if (!isActive) {
        setTimeLeft(TURN_DURATION);
        hasTriggeredRef.current = false;
      }
    }

    return clearTimer;
  }, [isActive, isPaused, onTimeUp, clearTimer]);

  if (!isActive) return null;

  const progress = (timeLeft / TURN_DURATION) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="turn-timer">
      <div className="turn-timer-label">⏱ Timer</div>
      <div className="turn-timer-display">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className="turn-timer-ring"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="var(--color-panel-dark)"
            stroke="var(--color-border-subtle)"
            strokeWidth="2"
          />
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke={isCritical ? "#ef4444" : isLow ? "#f59e0b" : "var(--color-gold-base)"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 14}
            strokeDashoffset={(2 * Math.PI * 14) - (progress / 100) * (2 * Math.PI * 14)}
            transform="rotate(-90 20 20)"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
          />
        </svg>
        <span
          className="turn-timer-text"
          style={{
            color: isCritical ? "#ef4444" : isLow ? "#f59e0b" : "var(--color-text-primary)",
          }}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

TurnTimer.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onTimeUp: PropTypes.func.isRequired,
  isPaused: PropTypes.bool,
};

TurnTimer.defaultProps = {
  isPaused: false,
};

export default TurnTimer;
