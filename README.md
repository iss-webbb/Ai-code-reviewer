# AI Code Reviewer

An intelligent code review platform powered by Google's GenAI. Submit your code and receive instant, detailed reviews with actionable insights for bug detection, performance optimization, security improvements, and code style enhancements.

**Live Demo:** [ai-code-reviewer-seven-red.vercel.app](https://ai-code-reviewer-seven-red.vercel.app)

---

## Features

- **Multi-Language Support** – Review code in JavaScript, TypeScript, React, Python, Go, C, and C++
- **Real-Time Analysis** – Get instant feedback powered by Google's Gemini AI
- **Categorized Feedback** – Issues organized by type: bugs, performance, security, and style
- **Code Editor** – Built-in Monaco editor with syntax highlighting
- **Review History** – Local storage persistence for tracking previous reviews
- **Dark Theme UI** – Optimized for extended coding sessions

---

## Tech Stack

- **Frontend:** React 19 with Next.js 16
- **Language:** TypeScript
- **Editor:** Monaco Editor
- **Styling:** Tailwind CSS 4
- **AI:** Google GenAI SDK
- **Deployment:** Vercel
- **Build Tool:** Next.js with ESLint & PostCSS

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Google GenAI API key

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/iss-webbb/Ai-code-reviewer.git
cd Ai-code-reviewer
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GENAI_API_KEY=your_google_genai_api_key
```

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Paste Code** – Enter or paste code in the editor window
2. **Select Language** – Choose the programming language from the dropdown
3. **Load Example** – Click "Example Code" to see a sample review
4. **Submit Review** – Click "Submit" to analyze your code
5. **View Results** – Review categorized feedback on the right panel
6. **Track History** – All reviews are saved automatically in browser storage

---

## API Endpoint

### POST `/api/review`

Analyzes code and returns structured review feedback.

**Request:**
```json
{
  "code": "function example() { ... }",
  "lang": "typescript"
}
```

**Response:**
```json
{
  "Message": "[{\"type\": \"bug\", \"message\": \"...\"}, ...]",
  "error": ""
}
```

---

## Build & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

Push to the main branch to trigger automatic deployment:

```bash
git push origin main
```

---

## Project Structure

```
.
├── app/
│   ├── page.tsx           # Main application component
│   ├── api/
│   │   └── review/        # AI review endpoint
│   └── layout.tsx
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

## Support

For issues, questions, or suggestions, please open an issue on [GitHub](https://github.com/iss-webbb/Ai-code-reviewer/issues).
