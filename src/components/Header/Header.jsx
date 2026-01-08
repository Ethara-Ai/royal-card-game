import { useState } from "react";
import PropTypes from "prop-types";
import HeaderBranding from "./HeaderBranding";
import ThemeToggle from "./ThemeToggle";
import SettingsPanel from "./SettingsPanel";
import HelpButton from "./HelpButton";
import HowToPlayModal from "../HowToPlayModal";

/**
 * Header component - Main application header
 * Composes branding, theme toggle, help button, and settings panel subcomponents
 * This refactored version has high cohesion and proper decoupling
 */
const Header = ({
  theme,
  toggleTheme,
  selectedRuleSet,
  setSelectedRuleSet,
  ruleSets,
  resetGame,
}) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <header
        className="header-container py-2 px-3 sm:py-2 sm:px-4 relative z-50"
        style={{
          background:
            "linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
          <HeaderBranding onReset={resetGame} />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />

            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <SettingsPanel
              selectedRuleSet={selectedRuleSet}
              setSelectedRuleSet={setSelectedRuleSet}
              ruleSets={ruleSets}
              resetGame={resetGame}
            />
          </div>
        </div>
      </header>

      <HowToPlayModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        ruleSetName={ruleSets[selectedRuleSet]?.name || "Highest Card Wins"}
      />
    </>
  );
};

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  selectedRuleSet: PropTypes.number.isRequired,
  setSelectedRuleSet: PropTypes.func.isRequired,
  ruleSets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  resetGame: PropTypes.func.isRequired,
};

export default Header;
