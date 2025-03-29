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

### Interactive Sections
- **About Me (README.md)**: Overview of my background, skills, and experience
- **Projects (projects.json)**: Showcases my portfolio projects in JSON format
- **Skills (skills.html)**: Displays my technical skills with HTML
- **Contact (contact.md)**: Contact information and form in markdown

### Technical Highlights
- Built with React and Vite for optimal performance
- CSS variables for consistent theming across components
- Fully responsive design that works on desktop and mobile devices
- Real text editors with syntax highlighting and line numbers
- Custom implementation of VS Code's command system

## Getting Started

```bash
# Clone the repository
git clone https://github.com/pavankalisetti/vscode-portfolio

# Navigate to the project directory
cd vscode-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

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

## License

MIT License
