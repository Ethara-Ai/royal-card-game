import { createContext, useState } from "react";
import PropTypes from "prop-types";
import {
  DEFAULT_CARD_BACK_COLOR,
  DEFAULT_CARD_BACK_PATTERN,
} from "../constants";

/**
 * Context for card customization settings
 * Manages card back color and pattern preferences
 */
const CardCustomizationContext = createContext(null);

/**
 * Provider component for card customization context
 * Wraps application to provide card back color and pattern state
 */
export const CardCustomizationProvider = ({ children }) => {
  const [cardBackColor, setCardBackColor] = useState(DEFAULT_CARD_BACK_COLOR);
  const [cardBackPattern, setCardBackPattern] = useState(
    DEFAULT_CARD_BACK_PATTERN,
  );

  const value = {
    cardBackColor,
    setCardBackColor,
    cardBackPattern,
    setCardBackPattern,
  };

  return (
    <CardCustomizationContext.Provider value={value}>
      {children}
    </CardCustomizationContext.Provider>
  );
};

CardCustomizationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CardCustomizationContext;
