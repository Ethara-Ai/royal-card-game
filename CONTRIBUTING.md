# Contributing to Royal Card Game

Thank you for your interest in contributing to Royal Card Game! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and considerate in your communications
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for your mistakes and learn from them

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/royal-card-game.git
   cd royal-card-game
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/royal-card-game.git
   ```

## 💻 Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |

## 🤝 How to Contribute

### Types of Contributions

We welcome many types of contributions:

- **Bug fixes** - Fix issues and improve stability
- **New features** - Add new game modes, customization options, etc.
- **Documentation** - Improve README, add comments, write guides
- **UI/UX improvements** - Enhance the visual design and user experience
- **Performance** - Optimize code and improve load times
- **Accessibility** - Make the game more accessible to all users
- **Tests** - Add unit tests or integration tests

### Workflow

1. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly

4. **Commit your changes** with clear messages:
   ```bash
   git commit -m "feat: add new card animation"
   # or
   git commit -m "fix: resolve drag issue on mobile"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** against the `main` branch

## 📥 Pull Request Process

1. **Update documentation** if your changes require it
2. **Ensure all tests pass** and there are no linting errors
3. **Fill out the PR template** completely
4. **Request a review** from maintainers
5. **Address feedback** promptly and respectfully

### PR Title Convention

Use conventional commit format for PR titles:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code restructuring`
- `perf: performance improvements`
- `test: add tests`
- `chore: maintenance tasks`

## 📝 Coding Standards

### JavaScript/React

- Use functional components with hooks
- Use PropTypes for type checking
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful variable and function names

### File Organization

```
src/
├── components/     # React components
├── config/         # Configuration files
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── assets/         # Static assets
└── styles/         # Global styles
```

### Component Structure

```jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

export default ComponentName;
```

### CSS Guidelines

- Use CSS variables for theming
- Follow mobile-first responsive design
- Use meaningful class names
- Keep specificity low

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to reproduce** - How to trigger the bug
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Environment** - Browser, OS, device
6. **Screenshots** - If applicable

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Device: [e.g., iPhone 15]
```

## 💡 Suggesting Features

We love hearing ideas! When suggesting features:

1. **Check existing issues** - Your idea might already be suggested
2. **Be specific** - Describe the feature in detail
3. **Explain the benefit** - Why would this improve the game?
4. **Consider scope** - Is it feasible for this project?

### Feature Request Template

```markdown
**Feature description**
A clear description of the feature.

**Problem it solves**
What problem does this solve?

**Proposed solution**
How should it work?

**Alternatives considered**
Other approaches you've thought about.

**Additional context**
Any other relevant information.
```

## 🙏 Recognition

Contributors will be recognized in our README and release notes. We appreciate every contribution, no matter how small!

## ❓ Questions?

If you have questions, feel free to:

- Open a GitHub Discussion
- Comment on a relevant issue
- Reach out to maintainers

Thank you for contributing to Royal Card Game! 🃏