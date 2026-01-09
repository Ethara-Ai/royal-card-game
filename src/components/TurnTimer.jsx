import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";

const TURN_DURATION = 30;
const TIMER_RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

const getTimerStrokeColor = (isCritical, isLow) => {
  if (isCritical) return "#ef4444";
  if (isLow) return "#f59e0b";
  return "var(--color-gold-base)";
};

const getTimerTextColor = (isCritical, isLow) => {
  if (isCritical) return "#ef4444";
  if (isLow) return "#f59e0b";
  return "var(--color-text-primary)";
};

const TurnTimer = ({ isActive, onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const intervalRef = useRef(null);
  const hasTriggeredRef = useRef(false);
  const initialTimeoutRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (initialTimeoutRef.current) {
      clearTimeout(initialTimeoutRef.current);
      initialTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      hasTriggeredRef.current = false;
      let currentTime = TURN_DURATION;

      const tick = () => {
        setTimeLeft(currentTime);
        if (currentTime <= 0) {
          clearTimer();
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onTimeUp();
          }
        } else {
          currentTime -= 1;
        }
      };

      initialTimeoutRef.current = setTimeout(tick, 0);
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTimer();
      if (!isActive) {
        hasTriggeredRef.current = false;
      }
    }

    return clearTimer;
  }, [isActive, isPaused, onTimeUp, clearTimer]);

  if (!isActive) return null;

  const progress = (timeLeft / TURN_DURATION) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;
  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="turn-timer">
      <div className="turn-timer-label">⏱ TIME LEFT</div>
      <div className="turn-timer-display">
        <svg className="turn-timer-ring" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="var(--color-panel-dark)"
            stroke="var(--color-border-subtle)"
            strokeWidth="3"
          />
          <circle
            cx="30"
            cy="30"
            r={TIMER_RADIUS}
            fill="none"
            stroke={getTimerStrokeColor(isCritical, isLow)}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 30 30)"
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
            }}
          />
        </svg>
        <span
          className="turn-timer-text"
          style={{
            color: getTimerTextColor(isCritical, isLow),
          }}
        >
          {timeLeft}s
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
