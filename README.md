# 🐍 Snake Game

A classic Snake game developed using pure HTML, CSS, and JavaScript, featuring a modern interface design and smooth gameplay experience.

## ✨ Features

### 🎮 Core Gameplay
- **Classic Snake Mechanics**: Control the snake to eat food and avoid collisions
- **Real-time Score System**: Displays current score and high score record
- **Multiple Difficulty Levels**: Easy, Medium, and Hard speed modes
- **Adjustable Grid Size**: Three grid options: 20x20, 25x25, 30x30
- **Game State Management**: Start, pause, resume, and restart

### 🎨 Interface Design
- **Modern UI**: Simple and visually appealing interface
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Seamless transitions and interactive feedback
- **Visual Feedback**: Clear color differentiation and state indications

### 🎯 Controls
- **Keyboard Control**: Arrow keys to move the snake
- **Mouse Control**: On-screen buttons for direction
- **Shortcuts**: Spacebar to pause/resume the game
- **Touch Friendly**: Button design suitable for mobile devices

## 🚀 Quick Start

### Requirements
- Modern browser (supports HTML5 Canvas)
- No additional dependencies or installation required

### Running the Game
1. Download the project files to your local device
2. Open the `index.html` file in your browser
3. Start playing!

## 🎮 Gameplay Controls

### Basic Controls
- **Arrow Keys**: Control the direction of the snake
- **Spacebar**: Pause/Resume the game
- **Start Button**: Begin a new game
- **Pause Button**: Pause the current game
- **Restart**: Reset the game

### Game Rules
1. Use arrow keys to control the snake’s movement
2. Eating red food grows the snake and increases your score
3. Avoid hitting walls or the snake itself
4. Game speed varies with difficulty settings
5. Challenge yourself for a higher score!

## 🛠️ Technical Implementation

### Tech Stack
- **HTML5**: Page structure and Canvas rendering
- **CSS3**: Styling and responsive layout
- **JavaScript ES6+**: Game logic and interaction

### Core Architecture
- **Object-Oriented Design**: Classes encapsulate game components
- **Modular Structure**: Clear code organization and separation
- **Event-Driven**: Responsive user interaction handling
- **State Management**: Comprehensive game state control

### Performance Optimization
- **requestAnimationFrame**: Smooth game loop
- **Canvas Rendering**: Efficient graphics drawing
- **Local Storage**: Persistent high score record
- **Memory Management**: Avoid memory leaks

## 📁 Project Structure

```
snake-game/
├── index.html          # Main page file
├── style.css           # Stylesheet
├── script.js           # Game logic
└── README.md           # Project documentation
```

## 🎨 Customization

### Change Game Settings
You can adjust the following parameters in `script.js`:

```javascript
// Difficulty speed settings (milliseconds)
const DIFFICULTY_SPEEDS = {
    easy: 150,    // Easy mode
    medium: 100,  // Medium mode
    hard: 70      // Hard mode
};

// Grid size options
// Change in the HTML select element
```

### Custom Styles
Modify in `style.css`:

```css
/* Color theme */
:root {
    --primary-color: #4CAF50;    /* Primary color */
    --secondary-color: #2196F3;  /* Secondary color */
    --danger-color: #f44336;     /* Danger color */
    /* ... */
}
```

## 🌟 Game Highlights

### User Experience
- **Intuitive Interface**: Clear information display and operation prompts
- **Smooth Animations**: Seamless movement and transitions
- **Instant Feedback**: Real-time score updates and state changes
- **Accessibility**: Supports both keyboard and mouse operations

### Gameplay Experience
- **Classic Mechanics**: Retains the core fun of traditional Snake
- **Modern Enhancements**: Adds features like pause and settings
- **Challenge**: Multiple difficulty levels and grid sizes
- **Sense of Achievement**: Score tracking and high score challenge

## 🔧 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 📝 Changelog

### v1.0.0 (2024-01-01)
- 🎉 Initial release
- ✨ Full Snake game functionality
- 🎨 Modern UI design
- 📱 Responsive layout support
- 💾 Local storage for high scores

## 🤝 Contributing

You are welcome to submit Issues and Pull Requests to improve this project!

### Development Suggestions
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

Thanks to everyone who provided inspiration and help for this project!

---

**Enjoy the game and challenge your high score!** 🎮✨
