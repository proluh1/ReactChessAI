# ReactChessAI

![ReactChessAI](ReactChessAI-logo.png)

A modern, interactive chess application built with React and TypeScript, featuring drag-and-drop piece movement, AI opponent capabilities, and customizable board themes.

## Features

- ♟️ **Full Chess Implementation** - Complete chess rules engine with move validation
- 🤖 **AI Opponent** - Play against an intelligent chess engine
- 🎨 **Customizable Themes** - Multiple board color palettes for personalized gameplay
- 🎯 **Drag-and-Drop Interface** - Intuitive piece movement with visual feedback
- 🔊 **Sound Effects** - Audio feedback for moves and captures
- 📝 **FEN Support** - Load and save game positions using FEN notation
- 🎮 **Responsive Design** - Works seamlessly on desktop and tablet devices

## Tech Stack

- **Frontend Framework** - React 18+ with TypeScript
- **Build Tool** - Vite
- **Styling** - CSS
- **State Management** - React Context API
- **Linting** - ESLint

## Project Structure

```
src/
├── componets/          # React components
│   ├── board/          # Chess board components
│   ├── SideBarInfo.tsx # Game information sidebar
│   └── SideBarOptions.tsx # Game options sidebar
├── config/             # Configuration files
│   ├── defaultFen.json # Default chess positions
│   └── palettes.json   # Color themes
├── context/            # React Context providers
│   ├── ArrowContext.tsx # Arrow drawing state
│   ├── BoardDndContext.tsx # Drag-and-drop state
│   └── MoveOriginContex.tsx # Move tracking state
├── domain/             # Domain entities and logic
├── engine/             # Chess engine
│   └── BoardBuilder.ts # Board state management
├── hooks/              # Custom React hooks
├── services/           # Business logic services
├── storage/            # Local storage utilities
├── utils/              # Helper utilities
├── App.tsx             # Main application component
└── main.tsx            # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ReactChessAI.git
cd ReactChessAI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with any required environment variables

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

### Linting

Check code quality:
```bash
npm run lint
```

## How to Play

1. **Starting a Game** - The board initializes with the standard chess starting position
2. **Moving Pieces** - Click and drag pieces to move them (or click to select, click to place)
3. **Valid Moves** - Only legal chess moves are allowed
4. **Taking Turns** - Play against the AI opponent
5. **GameMode** - Use the sidebar to change game mode, only avaible Local Mode and AI Mode.
6. **Indicate Premove** - Right click drag piece to preview a move with an arrow. 

## Game Controls

- **Drag & Drop** - Move pieces around the board
- **Theme Selection** - Choose from available color palettes in options
- **Sound Toggle** - Enable/disable move sounds
- **New Game** - Start a fresh game at any time

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Enjoy your chess experience! ♔