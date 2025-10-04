# Run Pikachu! 🕹️
A browser game built with React, TypeScript, and Vite.

# Game Overview
Control Pikachu and avoid obstacles using your keyboard or touch:

- Enter: Start the game or open the score board
- Spacebar: Jump
- Arrow Down: Fast-fall while jumping
- On mobile, tap the screen to start and play. The game is fully responsive and supports mobile devices.

Share your score with friends and compete for the highest record!

# Features
- Responsive Design: Works seamlessly on desktop and mobile devices (minimum mobile compatibility implemented)
- Keyboard & Touch Controls: Play with keyboard or touch gestures
- Score Sharing: Share your score and challenge others
- Animated Obstacles: Dynamic obstacle generation and collision detection
- Sound & Music: Toggle background music and sound effects

# Development Structure
- React + Vite: Fast development environment with hot module replacement
- TypeScript: Type-safe codebase for reliability and maintainability
- Custom Hooks: Game logic (loop, jump, collision, score) is modularized using React hooks
- State Management: Centralized state management via Zustand
- Responsive UI: CSS and logic for adapting to various screen sizes
- Supabase Integration: For score storage and sharing (if enabled)
- Asset Management: All images, sounds, and fonts are managed in the public directory
