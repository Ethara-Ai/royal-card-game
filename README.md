# Royal Card Game

> **Version:** 1.0.0 | **Last Updated:** January 2026

A beautiful, responsive multiplayer card game built with React and Vite. Play classic trick-taking card games against AI opponents with customizable rules, themes, and card designs.


![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-4.0.16-6E9F18?logo=vitest)
![Coverage](https://img.shields.io/badge/Coverage-49%25-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Multiple Game Modes
Choose from different rule sets:
- **Highest Card Wins** - Simply play the highest value card to win the trick
- **Suit Follows** - Must follow lead suit if possible; highest card of lead suit wins
- **Spades Trump** - Spades beat all other suits; otherwise, highest card of lead suit wins

### Customizable Experience
- Dark and warm color themes with smooth transitions
- Customizable card back colors via color picker
- Multiple card back patterns (solid, checker, diagonal, diamond, dots, cross)
- Persistent settings saved to localStorage

### Accessibility Features
- **ARIA Labels** - Descriptive labels on interactive elements
- **Screen Reader Support** - ARIA live regions for turn announcements
- **Reduced Motion Support** - Respects `prefers-reduced-motion` user preference
- **High Contrast Support** - Enhanced visibility with `prefers-contrast: high`
- **Keyboard Accessible Buttons** - All buttons are keyboard focusable

### Fully Responsive
- Works on desktop, tablet, and mobile devices
- Tap-to-select card interaction for all devices
- Optimized layouts for all screen sizes
- Landscape menu for mobile orientation
- Adaptive UI components

### AI Opponents
- Play against 3 AI players
- Smooth animated card playing
- Player identification with "(You)" indicator for human player

### Polished UI/UX
- Smooth animations and transitions
- Card dealing animations with staggered delays
- Winner celebrations with confetti
- Real-time score tracking on leaderboard
- Toast notifications for game events
- Turn instruction overlay for new players
- Turn timer for paced gameplay
- How to Play modal with game rules
- Custom username support

### Production-Ready Monitoring
- **Error Tracking** - Sentry integration ready
  - Automatic error capture
  - Performance monitoring
  - User context tracking
- **Analytics** - Google Analytics & Mixpanel ready
  - Event tracking
  - User behavior analytics
- **Error Boundary** - Graceful error handling in React components

### Comprehensive Testing
- 1374 unit tests with Vitest
- Integration tests for full game flow
- Component testing with React Testing Library
- Accessibility testing
- ~49% code coverage
- Optimized test runner configuration

## Quick Start

### Prerequisites

- Node.js 18.x or higher (LTS recommended)
- npm 9.x or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Ethara-Ai/royal-card-game.git
cd royal-card-game
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Available Scripts

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start development server with hot reload   |
| `npm run build`        | Build for production                       |
| `npm run preview`      | Preview production build locally           |
| `npm run lint`         | Run ESLint to check code quality           |
| `npm run lint:fix`     | Run ESLint and auto-fix issues             |
| `npm run format`       | Format code with Prettier                  |
| `npm run format:check` | Check code formatting                      |
| `npm run clean`        | Remove dist and cache directories          |
| `npm test`             | Run all tests with Vitest                  |
| `npm run test:run`     | Run tests once (no watch)                  |
| `npm run test:watch`   | Run tests in watch mode                    |
| `npm run test:ui`      | Run tests with Vitest UI                   |
| `npm run test:coverage`| Run tests with coverage report             |
| `npm run test:verbose` | Run tests with verbose output              |

## Project Structure

```
src/
├── components/              # React components
│   ├── Card.jsx             # Individual card component
│   ├── CardColorPicker.jsx  # Card back color picker
│   ├── CardPatternPicker.jsx# Card back pattern selector
│   ├── DragHint.jsx         # Instruction hint overlay
│   ├── ErrorBoundary.jsx    # Error boundary wrapper
│   ├── GameTable.jsx        # Main game table with play area
│   ├── Header.jsx           # Main header component
│   ├── HeaderBranding.jsx   # Logo and title
│   ├── HelpButton.jsx       # Help modal trigger
│   ├── HowToPlayModal.jsx   # Game instructions modal
│   ├── LandscapeMenu.jsx    # Mobile landscape orientation menu
│   ├── Leaderboard.jsx      # Score display sidebar
│   ├── LoadingScreen.jsx    # Initial loading animation
│   ├── PlayedCard.jsx       # Card in play area
│   ├── PlayerPanel.jsx      # Opponent player display
│   ├── RuleSetSelector.jsx  # Game rules dropdown
│   ├── SettingsPanel.jsx    # Settings dropdown panel
│   ├── ThemeToggle.jsx      # Dark/light theme toggle
│   ├── TurnInstructionOverlay.jsx  # Turn guidance overlay
│   ├── TurnTimer.jsx        # Turn countdown timer
│   ├── UserHand.jsx         # Player's hand of cards
│   ├── WaitingRoom.jsx      # Pre-game lobby
│   ├── WinnerModal.jsx      # Game over modal
│   └── index.js             # Component exports
├── config/
│   └── ruleSets.js          # Game rule configurations
├── constants/
│   ├── gameConstants.js     # Game configuration constants
│   ├── uiConstants.js       # UI-related constants
│   └── index.js             # Constants exports
├── context/
│   ├── CardCustomizationContext.jsx  # Card styling context
│   ├── GameContext.jsx      # Game state context
│   ├── useCardCustomization.js       # Card customization hook
│   ├── useGame.js           # Game context hook
│   └── index.js             # Context exports
├── hooks/
│   ├── accessibility/       # Accessibility hooks
│   │   └── useKeyboardNavigation.js  # Keyboard nav, focus trap, skip links
│   ├── game/                # Game-specific hooks
│   │   ├── gameReducer.js   # Game state reducer
│   │   ├── useCardDeck.js   # Deck management hook
│   │   ├── usePlayers.js    # Player state hook
│   │   ├── useTouchGestures.js  # Touch gesture utilities
│   │   └── useTrickEvaluation.js  # Trick evaluation logic
│   ├── useAppLoading.js     # App loading state hook
│   ├── useDragAndDrop.js    # Drag and drop utilities
│   ├── useGameLogic.js      # Core game logic hook
│   ├── useTheme.js          # Theme management hook
│   ├── useTimeout.js        # Timeout utility hook
│   ├── useWindowSize.js     # Window dimensions hook
│   └── index.js             # Hooks exports
├── services/
│   ├── analytics.js         # Analytics service integration
│   └── errorTracking.js     # Error tracking service
├── styles/
│   ├── gameStyles.css       # Game-specific animations and styles
│   └── index.js             # Styles exports
├── test/
│   ├── integration/         # Integration tests
│   ├── setup.js             # Test configuration
│   └── testUtils.jsx        # Test helper utilities
├── utils/
│   ├── cardHelpers.jsx      # Card display utilities
│   ├── errorLogger.js       # Error logging utilities
│   ├── patterns.js          # Card back pattern utilities
│   ├── playerUtils.js       # Player name formatting utilities
│   ├── sanitize.js          # Input sanitization utilities
│   └── index.js             # Utils exports
├── App.jsx                  # Main application component
├── App.test.jsx             # App component tests
├── index.css                # Global styles and CSS variables
└── main.jsx                 # Application entry point
```

## Component Descriptions

### Card
Renders an individual playing card in the user's hand with suit icon, rank display, and appropriate coloring. Features a fan-out layout with rotation and vertical offset based on card position, plus dealing animation support. Click to select a card.

### GameTable
The main game area featuring an oval poker table with felt texture gradient. Contains the central play area where selected cards are played, positioned opponent panels around the table edges, and the user's hand at the bottom. Includes a hint overlay that guides new players on their first turn.

### Header
Application header with game title, help button, theme toggle, and settings panel. The collapsible settings menu allows users to select rule sets, customize card back colors via a color picker, and choose card back patterns. Clicking the title resets the game.

### HowToPlayModal
Modal dialog explaining game rules and controls. Displays basic rules (select to play, take turns, win tricks, win the game), current rule set details, and card value rankings. Accessible via the help button in the header.

### Leaderboard
Sidebar component displaying player rankings sorted by score. Shows player avatars (via RoboHash), names with "(You)" indicator for human player, current scores, and a visual pulse indicator for whose turn it is. Updates dynamically with score animations as tricks are won.

### LoadingScreen
Initial loading screen with animated Ace of Spades card, progress bar, and themed background effects. Displays while game assets and fonts load with smooth fade-out transition upon completion.

### PlayedCard
Renders a card that has been played to the center play area. Features entrance animation from the player's position to the target location with rotation. Includes a winner glow effect when the card wins the current trick.

### PlayerPanel
Compact panel displaying an AI opponent's information including avatar, name, turn status ("Playing..." or "Waiting"), card count, and a visual representation of their remaining cards (shown face-down with customizable back color and pattern).

### TurnInstructionOverlay
Animated overlay that appears during the player's turn with a pulsing "Your Turn" indicator and instruction text prompting them to select a card and tap the play area.

### TurnTimer
Visual countdown timer that displays during the player's turn, providing time pressure and paced gameplay.

### UserHand
The human player's hand display panel showing avatar, name with "(You)" indicator, turn status, and all cards fanned out. Cards are rendered using the Card component and become interactive (clickable) when it's the player's turn during the playing phase.

### WaitingRoom
Pre-game lobby screen with username input field, rule set selector dropdown, and player grid showing all four players (one human, three AI) with avatars and ready status. Contains the "Start Game" button which enables once a username is entered.

### WinnerModal
End-of-game modal overlay displaying "Game Over!" title, final scores sorted by rank, and player standings. Highlights the winner with a crown icon and gold styling. Shows "(You)" indicator for human player. Includes a "Play Again" button to reset and start a new game.

### ErrorBoundary
React error boundary component that catches JavaScript errors in child components, logs them, and displays a fallback UI instead of crashing the entire application.

### LandscapeMenu
Mobile-optimized menu that appears when the device is in landscape orientation, providing easy access to game controls and settings.

## Custom Hooks

### useGameLogic
Core game state management hook handling card dealing, playing, AI turns, trick evaluation, scoring, and game flow. Manages game phases (waiting, dealing, playing, evaluating, game over).

### Modular Game Hooks

#### usePlayers
Manages player state, usernames, and player-related operations. Provides functions for updating player hands, scores, and properties.

#### useCardDeck
Handles deck creation, shuffling, and card operations. Includes utilities for dealing, sorting, filtering, and finding cards.

#### useTrickEvaluation
Manages trick evaluation, winner determination, and play area. Handles trick completion and score updates.

#### useTouchGestures
Touch gesture utilities for swipe, long press, tap, double tap, drag, and pinch gestures. Available for mobile interactions.

#### gameReducer
Redux-style reducer for managing complex game state transitions with actions and selectors.

### useTheme
Theme management hook providing dark/warm theme toggle with localStorage persistence and document attribute updates.

### useAppLoading
Loading state hook that tracks font loading and initial app readiness.

### useWindowSize
Window dimension tracking hook for responsive layout calculations.

### useTimeout
Utility hook for managing timeouts with automatic cleanup.

## How to Play

1. **Enter Your Name** - Type your name in the waiting room (required to start)
2. **Select Rules** - Choose a game mode from the dropdown
3. **Start the Game** - Click "Start Game" to begin
4. **Select a Card** - Tap/click a card from your hand to select it
5. **Play the Card** - Tap/click the center play area to play your selected card
6. **Win Tricks** - The winner of each trick scores a point (based on selected rules)
7. **Win the Game** - The player with the most points when all 7 cards are played wins!

### Card Values
- **Ace (A)** - Highest value (14)
- **King (K)** - 13
- **Queen (Q)** - 12
- **Jack (J)** - 11
- **Number Cards (10-2)** - Face value

## Customization

Access the settings menu (gear icon) to customize:

- **Rule Set** - Change the game rules (Highest Card Wins, Suit Follows, Spades Trump)
- **Card Back Color** - Choose any color for card backs using the color picker
- **Card Pattern** - Select from 6 different patterns:
  - Solid
  - Checker
  - Diagonal
  - Diamond
  - Dots
  - Cross

Toggle the theme using the sun/moon icon in the header.

## Tech Stack

- **[React 19](https://react.dev/)** - UI framework with hooks
- **[Vite](https://vite.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing
- **[react-icons](https://react-icons.github.io/react-icons/)** - Icon library
- **[react-colorful](https://omgovich.github.io/react-colorful/)** - Color picker
- **[react-confetti](https://github.com/alampros/react-confetti)** - Celebration effects
- **[sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests once (no watch)
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/components/Card.test.jsx

# Run tests with verbose output
npm run test:verbose
```

The project includes 1374 tests covering:
- Component rendering and interactions
- Game logic and state management
- Custom hooks behavior
- Utility functions
- Edge cases and accessibility

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025-2026 Royal Card Game

## Acknowledgments

- Card suit icons from [react-icons](https://react-icons.github.io/react-icons/)
- Player avatars from [RoboHash](https://robohash.org/)
- Design inspired by classic casino card games

---

Made with React

*Royal Card Game v1.0.0*
