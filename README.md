# 🃏 Royal Card Game

A beautiful, responsive multiplayer card game built with React and Vite. Play classic trick-taking card games against AI opponents with customizable rules, themes, and card designs.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🎮 Multiple Game Modes** - Choose from different rule sets:
  - Highest Card Wins
  - Suit Follows (must follow lead suit)
  - Spades Trump (spades beat all other suits)

- **🎨 Customizable Experience**
  - Dark and warm color themes
  - Customizable card back colors
  - Multiple card back patterns (solid, checker, diagonal, diamond, dots, cross)

- **📱 Fully Responsive**
  - Works on desktop, tablet, and mobile devices
  - Touch-friendly drag and drop for mobile play
  - Optimized layouts for all screen sizes

- **🤖 AI Opponents**
  - Play against 3 AI players
  - Smooth animated card playing

- **🎬 Polished UI/UX**
  - Smooth animations and transitions
  - Card dealing animations
  - Winner celebrations with confetti
  - Real-time score tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/royal-card-game.git
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

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Card.jsx         # Individual card component
│   ├── GameTable.jsx    # Main game table with play area
│   ├── Header.jsx       # App header with settings
│   ├── Leaderboard.jsx  # Score display sidebar
│   ├── LoadingScreen.jsx# Initial loading animation
│   ├── PlayedCard.jsx   # Card in play area
│   ├── PlayerPanel.jsx  # Opponent player display
│   ├── UserHand.jsx     # Player's hand of cards
│   ├── WaitingRoom.jsx  # Pre-game lobby
│   └── WinnerModal.jsx  # Game over modal
├── config/
│   └── ruleSets.js      # Game rule configurations
├── utils/
│   ├── cardHelpers.jsx  # Card display utilities
│   └── patterns.js      # Card back pattern utilities
├── App.jsx              # Main application component
├── index.css            # Global styles and CSS variables
└── main.jsx             # Application entry point
```

## 🎯 How to Play

1. **Start the Game** - Click "Start Game" in the waiting room
2. **Play Cards** - Drag a card from your hand to the center play area when it's your turn
3. **Win Tricks** - The winner of each trick scores a point
4. **Win the Game** - The player with the most points when all cards are played wins!

### Rule Sets

- **Highest Card Wins**: Simply play the highest value card to win the trick
- **Suit Follows**: You must follow the lead suit if possible; highest card of the lead suit wins
- **Spades Trump**: Spades beat all other suits; otherwise, highest card of lead suit wins

## 🎨 Customization

Access the settings menu (⚙️ icon) to customize:

- **Theme**: Toggle between dark and warm color modes
- **Rule Set**: Change the game rules
- **Card Back Color**: Choose any color for card backs
- **Card Pattern**: Select from 6 different patterns

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

1. Update `vite.config.js` with your base path:
```js
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

2. Build and deploy:
```bash
npm run build
# Use gh-pages or manually push dist/ to gh-pages branch
```

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** - UI framework
- **[Vite](https://vite.dev/)** - Build tool and dev server
- **[react-icons](https://react-icons.github.io/react-icons/)** - Icon library
- **[react-colorful](https://omgovich.github.io/react-colorful/)** - Color picker
- **[react-confetti](https://github.com/alampros/react-confetti)** - Celebration effects
- **[sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Card suit icons from [react-icons](https://react-icons.github.io/react-icons/)
- Player avatars from [RoboHash](https://robohash.org/)

---

Made with ❤️ and React