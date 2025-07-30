# 🏆 Code Battle Arena

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black.svg)](https://nextjs.org/)

A real-time competitive coding platform where developers battle head-to-head to solve algorithmic challenges under time pressure. Features live code sharing, test execution, and progress tracking.

## ✨ Features

- **Real-time Code Battles**: Compete 1v1 in timed coding challenges
- **Live Code Mirroring**: See opponent's keystrokes in real-time
- **Integrated Judge System**: Execute code against test cases with Judge0 API
- **Interactive Test Runner**: Visual feedback on test case results
- **Dynamic Scoreboard**: Live leaderboard with typing metrics
- **Battle Effects**: Visual feedback for test passes/fails
- **Multiple Problems**: Curated problems with varying difficulty
- **Responsive Design**: Works on desktop and tablet

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Monaco Editor (VS Code editor)
- Socket.IO Client

**Backend:**
- Node.js
- Express
- Socket.IO Server
- Judge0 API (code execution)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/code-battle-arena.git
cd code-battle-arena
Install dependencies:

bash
npm install
Set up environment variables:

bash
cp .env.example .env.local
Edit .env.local with your Judge0 API key:

env
JUDGE0_API_KEY=your_api_key_here
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
Running Locally
Start the development servers (in separate terminals):

Terminal 1 (Frontend):

bash
npm run dev
Terminal 2 (Backend):

bash
npm run server
Open http://localhost:3000 in your browser.

🏗 Project Structure
text
code-battle-arena/
├── src/
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   │   ├── BattleArena.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── TestRunner.tsx
│   │   └── ScoreBoard.tsx
│   ├── lib/               # Utility functions
│   │   ├── codeExecutor.ts
│   │   └── problems.ts
│   └── types/             # TypeScript types
├── server.ts              # Socket.IO server
├── package.json
└── tsconfig.json
🌐 Deployment
Vercel (Recommended)
https://vercel.com/button

Set up environment variables in Vercel dashboard.

Deploy both frontend and serverless functions.

Self-Hosted
Build the application:

bash
npm run build
Start production server:

bash
npm start
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for more information.

📧 Contact
Your Name - @yourtwitter - youremail@example.com

Project Link: https://github.com/your-username/code-battle-arena

🙏 Acknowledgments
Judge0 for code execution API

Lucide Icons for beautiful icons

Monaco Editor for code editing

🗺 Roadmap
Spectator mode

Multi-language support

Tournament system

Code replay feature
