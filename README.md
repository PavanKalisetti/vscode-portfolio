# VS Code Portfolio Website

A personal portfolio website designed to look and function like Visual Studio Code. This interactive portfolio showcases my skills, projects, and experience in a familiar IDE interface that developers will appreciate.

## Features

### VS Code-like Interface
- **Title Bar**: Complete with menu items, window controls, and VS Code branding
- **Activity Bar**: Navigate between different panels (Explorer, Search, Source Control, etc.)
- **Side Bar**: Context-specific panels that change based on the selected activity
- **Editor**: Central content area displaying different "files" of my portfolio
- **Status Bar**: Displays information like theme selection and additional metadata

### Core Functionality
- **File Explorer**: Browse through portfolio sections as if they were files
- **Search**: Find files or execute commands through a search interface
- **Command Palette**: Press Ctrl+Shift+P (or Cmd+Shift+P) to access all commands
- **Git Integration**: View my GitHub profile directly from the Source Control tab
- **Syntax Highlighting**: Real-time code highlighting in the editor for various languages
- **Light/Dark Theme**: Toggle between light and dark themes
- **Gemini AI Voice Assistant**: Talk to an AI assistant and get voice responses using Google's Gemini API

### Interactive Sections
- **About Me (README.md)**: Overview of my background, skills, and experience
- **Projects (projects.json)**: Showcases my portfolio projects in JSON format
- **Skills (skills.html)**: Displays my technical skills with HTML
- **Contact (contact.md)**: Contact information and form in markdown
- **Gemini AI**: Voice-activated AI assistant with speech-to-text and text-to-speech capabilities

### Technical Highlights
- Built with React and Vite for optimal performance
- CSS variables for consistent theming across components
- Fully responsive design that works on desktop and mobile devices
- Real text editors with syntax highlighting and line numbers
- Custom implementation of VS Code's command system
- Integration with Google's Gemini AI API
- Web Speech API for voice recognition and synthesis

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-vscode

# Navigate to the project directory
cd portfolio-vscode

# Install dependencies
npm install

# Set up your Gemini API key in .env file
cp .env.example .env
# Then edit .env and add your Gemini API key

# Start the development server
npm run dev
```

## Using the Gemini AI Assistant

1. Click on the AI Assistant icon in the Activity Bar (the 6th icon from the top)
2. **Voice Input**: Click the "Start Listening" button to speak to the AI
3. **Text Input**: Alternatively, type your question in the text box and click "Send"
4. The AI will respond with both text and voice
5. Click "Stop Speaking" to interrupt the AI's voice response

**Note**: Speech recognition may not work in all environments (especially in some deployed environments). The text input option is provided as a reliable alternative.

You can also customize the AI's behavior:
1. Click "Show System Prompt" to reveal the system instructions
2. Edit the instructions to change how the AI responds (e.g., make it more formal, have it focus on specific topics, etc.)
3. The changes take effect immediately for future interactions

## Environment Variables

This project uses environment variables to securely store API keys. To set up:

1. Create a `.env` file in the root directory (you can copy from `.env.example`)
2. Add your Gemini API key as follows:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. The `.env` file is automatically excluded from Git in `.gitignore` to prevent exposing your API key

## Gemini AI Implementation Details

The portfolio uses the official Google Generative AI JavaScript SDK:

```bash
# Install the SDK if making changes
npm install @google/generative-ai
```

Key features of the implementation:
- System prompts to customize AI behavior
- Speech-to-text using the Web Speech API (with fallback to text input)
- Text-to-speech for AI responses
- Conversation history tracking
- Error handling for different browser environments
- Console logging of both speech input and AI responses

## Common Deployment Issues

### Speech Recognition Issues
When deploying to platforms like Vercel, speech recognition might encounter network errors due to:
- Security restrictions for microphone access in production environments
- Cross-origin policies in browsers
- HTTPS requirements for Web Speech API

The text input option is provided as a reliable alternative in environments where speech recognition isn't available.

## Customization

This portfolio is designed to be easily customizable. Update the content in:
- `src/components/AboutSection.jsx`
- `src/components/ProjectsSection.jsx`
- `src/components/SkillsSection.jsx`
- `src/components/ContactSection.jsx`

## Technologies Used

- React
- Vite
- CSS3 with custom properties
- PrismJS for syntax highlighting
- Google Generative AI SDK
- Web Speech API

## License

MIT License
