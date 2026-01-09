import PropTypes from "prop-types";
import {
  FaTimes,
  FaHandPaper,
  FaTrophy,
  FaCrown,
  FaGamepad,
} from "react-icons/fa";
import { GiCardPlay, GiSpades } from "react-icons/gi";

/**
 * HowToPlayModal - Modal component displaying game instructions
 * Responsive design that works across all screen sizes
 * Supports theme switching (dark/light mode)
 */
const HowToPlayModal = ({
  isOpen,
  onClose,
  ruleSetName = "Highest Card Wins",
}) => {
  if (!isOpen) return null;

  const rules = [
    {
      icon: <GiCardPlay className="text-xl sm:text-2xl" />,
      title: "Select to Play",
      description:
        "Select a card from your hand to play it to the center play area when it's your turn.",
    },
    {
      icon: <FaHandPaper className="text-xl sm:text-2xl" />,
      title: "Take Turns",
      description:
        "Players take turns clockwise. Wait for the green indicator showing it's your turn.",
    },
    {
      icon: <FaTrophy className="text-xl sm:text-2xl" />,
      title: "Win Tricks",
      description:
        "Each round, the player with the winning card takes the trick and scores a point.",
    },
    {
      icon: <FaCrown className="text-xl sm:text-2xl" />,
      title: "Win the Game",
      description:
        "The player with the most points when all cards are played wins the game!",
    },
  ];

  const ruleSetDescriptions = {
    "Highest Card Wins": {
      icon: <GiCardPlay className="text-lg" />,
      description:
        "The player who plays the highest value card wins the trick. Ace is the highest (14), then King (13), Queen (12), etc.",
    },
    "Suit Follows": {
      icon: <FaHandPaper className="text-lg" />,
      description:
        "Players must follow the suit of the first card played. The highest card of the lead suit wins. Other suits don't count!",
    },
    "Spades Trump": {
      icon: <GiSpades className="text-lg" />,
      description:
        "Spades are trump cards and beat all other suits. If spades are played, the highest spade wins. Otherwise, highest of lead suit wins.",
    },
  };

  const currentRuleSet =
    ruleSetDescriptions[ruleSetName] ||
    ruleSetDescriptions["Highest Card Wins"];
  const displayRuleName = ruleSetName || "Highest Card Wins";

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4"
      style={{
        background: "var(--color-bg-overlay)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      {/* Parent container: clips content with border-radius + overflow:hidden */}
      <div
        className="modal-wrapper w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden bounce-in"
        style={{
          background:
            "linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-base) 100%)",
          border: "1px solid var(--color-border-default)",
          boxShadow: "var(--shadow-xl)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Child container: handles scrolling inside the clipped area */}
        <div className="modal-content w-full h-full max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <div
            className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b z-10"
            style={{
              background: "var(--color-panel-base)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <FaGamepad
                className="text-xl sm:text-2xl"
                style={{ color: "var(--color-gold-light)" }}
              />
              <h2
                className="text-lg sm:text-xl md:text-2xl font-semibold game-title"
                style={{ color: "var(--color-text-gold)" }}
              >
                How to Play
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
              style={{
                background: "var(--color-panel-dark)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border-subtle)",
              }}
              aria-label="Close modal"
            >
              <FaTimes className="text-base sm:text-lg" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
            {/* Basic Rules Section */}
            <div>
              <h3
                className="text-sm sm:text-base font-medium uppercase tracking-wider mb-3 sm:mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Basic Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {rules.map((rule, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: "var(--color-panel-dark)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg shrink-0 flex items-center justify-center"
                        style={{
                          background: "var(--color-panel-base)",
                          color: "var(--color-gold-light)",
                        }}
                      >
                        {rule.icon}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className="font-semibold text-sm sm:text-base mb-1"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {rule.title}
                        </h4>
                        <p
                          className="text-xs sm:text-sm leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Rule Set Section */}
            <div>
              <h3
                className="text-sm sm:text-base font-medium uppercase tracking-wider mb-3 sm:mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Current Rule Set
              </h3>
              <div
                className="p-4 sm:p-5 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-felt-dark) 0%, var(--color-felt-base) 100%)",
                  border: "1px solid var(--color-border-gold)",
                  boxShadow: "var(--shadow-glow-gold)",
                }}
              >
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span style={{ color: "var(--color-gold-light)" }}>
                    {currentRuleSet.icon}
                  </span>
                  <h4
                    className="font-bold text-base sm:text-lg"
                    style={{ color: "var(--color-gold-light)" }}
                  >
                    {displayRuleName}
                  </h4>
                </div>
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: "var(--color-text-on-felt)" }}
                >
                  {currentRuleSet.description}
                </p>
              </div>
            </div>

            {/* Card Values Section */}
            <div>
              <h3
                className="text-sm sm:text-base font-medium uppercase tracking-wider mb-3 sm:mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Card Values
              </h3>
              <div
                className="p-3 sm:p-4 rounded-xl"
                style={{
                  background: "var(--color-panel-dark)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {[
                    { rank: "A", value: "14 (Highest)" },
                    { rank: "K", value: "13" },
                    { rank: "Q", value: "12" },
                    { rank: "J", value: "11" },
                    { rank: "10-2", value: "Face value" },
                  ].map((card, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-2 sm:p-3 rounded-lg min-w-15 sm:min-w-17.5"
                      style={{
                        background: "var(--color-card-white)",
                        border: "1px solid var(--color-card-border)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <span
                        className="font-bold text-lg sm:text-xl"
                        style={{ color: "var(--color-card-black)" }}
                      >
                        {card.rank}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs mt-1"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {card.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div>
              <h3
                className="text-sm sm:text-base font-medium uppercase tracking-wider mb-3 sm:mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Pro Tips
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Watch the leaderboard to track who's winning",
                  "Pay attention to which cards have been played",
                  "Change rule sets in the settings for different strategies",
                  "The current player is highlighted with a green indicator",
                ].map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--color-gold-light)" }}
                    >
                      ★
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div
            className="sticky bottom-0 p-4 sm:p-5 border-t"
            style={{
              background: "var(--color-panel-base)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-gold-base) 0%, var(--color-gold-dark) 100%)",
                color: "#ffffff",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              Got it, let&apos;s play!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

HowToPlayModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ruleSetName: PropTypes.string.isRequired,
};

export default HowToPlayModal;
