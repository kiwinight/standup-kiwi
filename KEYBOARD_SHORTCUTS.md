# Global Keyboard Shortcuts

The Current User Standup Card now supports global keyboard shortcuts that work from anywhere on the board page, similar to Slack's keyboard shortcuts.

## Available Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `E` | Edit | Enter edit mode for your current standup |
| `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux) | Save | Save your standup changes |
| `Escape` | Cancel | Cancel editing and revert changes |

## How It Works

- **Global scope**: Shortcuts work from anywhere on the board page - no need to focus the standup card first
- **Input-aware**: Shortcuts are automatically disabled when typing in input fields, textareas, or any editable content
- **Cross-platform**: Supports both Mac (`Cmd+Enter`) and Windows/Linux (`Ctrl+Enter`) conventions
- **Non-intrusive**: Only active on board pages where the current user standup card is present

## Implementation Details

The shortcuts are implemented using a custom `useKeyPress` hook located at `apps/web/app/hooks/use-key-press.ts`. This hook:

- Listens for keyboard events at the window level
- Automatically detects when users are typing in form fields and disables shortcuts
- Supports complex key combinations with modifiers
- Handles proper cleanup of event listeners

## Usage in Code

```tsx
import { useKeyPress } from "~/hooks/use-key-press";

// Single key
useKeyPress("e", () => handleEdit());

// Key combination with multiple options
useKeyPress(["Meta+Enter", "Control+Enter"], () => handleSave());

// With custom options
useKeyPress("Escape", handleCancel, {
  preventInInputs: false, // Allow in input fields if needed
  event: "keyup"          // Listen for keyup instead of keydown
});
```

## User Experience

This implementation provides a more intuitive user experience similar to popular applications like Slack, where users can quickly edit their content using familiar keyboard shortcuts without needing to navigate and click specific UI elements first.