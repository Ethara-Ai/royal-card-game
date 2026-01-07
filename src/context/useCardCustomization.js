import { useContext } from "react";
import CardCustomizationContext from "./CardCustomizationContext";

/**
 * Hook to access card customization context
 * @returns {Object} Card customization state and setters
 * @throws {Error} If used outside of CardCustomizationProvider
 */
export const useCardCustomization = () => {
  const context = useContext(CardCustomizationContext);
  if (!context) {
    throw new Error(
      "useCardCustomization must be used within a CardCustomizationProvider",
    );
  }
  return context;
};

export default useCardCustomization;
