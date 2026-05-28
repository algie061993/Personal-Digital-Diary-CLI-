# Personal Digital Diary

A simple command-line diary application built with Node.js.

## Features

- Add new diary entries with timestamps
- View all diary entries
- Update existing diary entries
- Search entries by keyword
- Data persisted in JSON file

## Requirements

- Node.js (v12 or higher)

## Installation

1. Clone or download this repository.
2. Ensure Node.js is installed.
3. No additional dependencies required (uses built-in `fs` module).

## Usage

Run the script with Node.js:

```bash
node diary.js <command> [options]
```

### Commands

- `add --entry "Your diary entry"`  
  Add a new diary entry.

- `update --id <entry_id> --entry "Updated diary entry text"`  
  Update an existing diary entry by ID.

- `view`  
  Display all diary entries.

- `search --keyword "Your search term"`  
  Search for entries containing the keyword (case-insensitive).

- `help`  
  Show usage instructions.

### Examples

Add an entry:
```bash
node diary.js add --entry "Today I learned about Node.js file system."
```

Update an entry:
```bash
node diary.js update --id 2 --entry "Updated my learning progress"
```

View all entries:
```bash
node diary.js view
```

Search entries:
```bash
node diary.js search --keyword "Node.js"
```

## How It Works

The application stores diary entries in a `diary.json` file in the same directory. Each entry includes:
- `id`: Unique identifier
- `date`: Human-readable date (MM/DD/YYYY)
- `timestamp`: ISO timestamp
- `entry`: The diary text

When adding an entry, the app reads existing entries, determines the next ID, appends the new entry, and writes back to the file.

When updating an entry, the app finds the entry by ID, updates its text and timestamp, and saves the changes back to the file.

## File Structure

- `diary.js` - Main application logic
- `diary.json` - Storage for diary entries (created automatically when first entry is added)

## License

This project is open source and available under the MIT License.