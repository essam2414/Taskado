# Constraints for Note Entity

1. The `title` field must always have a value (required) to uniquely identify each note.
2. The `content` field is required and should have a minimum length (e.g., at least 10 characters) to ensure meaningful notes.
3. `createdAt` is automatically set when a note is created.
4. `updatedAt` is automatically updated whenever the note is modified.
