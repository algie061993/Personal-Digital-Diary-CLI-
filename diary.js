const fs = require("fs"); // File system module for reading and writing files

const command = process.argv[2]; // Get the command (add or view)
const sentence = process.argv[4]; // Get the diary entry text
const keyword = process.argv[4]; // Get the search keyword
const id = parseInt(process.argv[4], 10); // Get the entry ID for updating an entry, parsed as an integer
const newEntry = process.argv[6]; // Get the new entry text for updating an entry
/**
 * Adds a new diary entry to the diary file with a unique ID, date, and timestamp.
 * The function checks for existing entries to ensure that each new entry has a unique ID by finding
 * the maximum ID among existing entries and incrementing it for the new entry.
 * The new entry is then added to the array of diary entries and saved back to the file in JSON format.
 * @param {string} entry - The diary entry text
 */
const addDiaryEntry = (entry) => {
  const timestamp = new Date().toISOString(); // Get the current timestamp
  const date = new Date().toLocaleDateString(); // Get the current date

  let diaryEntries = [];
  if (fs.existsSync("diary.json")) {
    const data = fs.readFileSync("diary.json", "utf-8"); // Read existing diary entries from the file
    diaryEntries = JSON.parse(data); // Parse the JSON data into an array
  }

  let maxId = 0; // Find the maximum ID among existing entries to assign a unique ID to the new entry
  // Loop through existing diary entries to find the maximum ID
  for (const diaryEntry of diaryEntries) {
    if (diaryEntry.id > maxId) {
      maxId = diaryEntry.id;
    }
  }

  const nextId = maxId + 1; // Calculate the next ID by incrementing the maximum ID found

  // Create a new diary entry object with the assigned ID, date, timestamp, and entry text
  const newEntry = {
    id: nextId,
    date: date,
    timestamp: timestamp,
    entry: entry,
  };

  diaryEntries.push(newEntry); // Add the new entry to the diary entries array
  fs.writeFileSync("diary.json", JSON.stringify(diaryEntries, null, 2)); // Write the updated entries back to the file
  console.log("Diary entry added successfully!");
};
/**
 * Updates an existing diary entry with the specified ID.
 * @param {number} id - The ID of the diary entry to update
 * @param {Object} newEntry - The updated diary entry object
 * @returns {void}
 */

const updateDiaryEntry = (id, newEntry) => {
  if (!fs.existsSync("diary.json")) {
    console.log("No diary entries found.");
    return;
  }

  // Validate the ID and new entry text before proceeding with the update
  if (isNaN(id)) {
    console.log("Invalid ID. Please provide a numeric ID.");
    return;
  }

  // Validate the new entry text to ensure it is a non-empty string
  if (typeof newEntry !== "string" || newEntry.trim() === "") {
    console.log("Invalid entry text. Please provide a non-empty string.");
    return;
  }

  const data = fs.readFileSync("diary.json", "utf-8"); // Read existing diary entries from the file
  const diaryEntries = JSON.parse(data); // Parse the JSON data into an array

  const entryIndex = diaryEntries.findIndex((entry) => entry.id === id); // Find the index of the entry with the specified ID
  if (entryIndex === -1) {
    console.log(`No diary entry found with ID ${id}.`);
    return;
  }
  // Update the entry text and timestamp for the specified entry
  diaryEntries[entryIndex].entry = newEntry; // Update the entry text with the new entry provided
  console.log(
    `Updating diary entry with ID ${id}... and the Entry Text: ${newEntry}`,
  ); // Log a message indicating that the entry is being updated
  diaryEntries[entryIndex].timestamp = new Date().toISOString();
  fs.writeFileSync("diary.json", JSON.stringify(diaryEntries, null, 2)); // Write the updated entries back to the file
  console.log(`Diary entry with ID ${id} updated successfully!`);
};

/**
 * Deletes a diary entry with the specified ID.
 * The function checks if the diary file exists and reads its contents.
 * If the file does not exist, it displays a message indicating that no diary entries are found.
 * @param {number} id - The ID of the diary entry to delete
 * @returns {void}
 */
const deleteDiaryEntry = (id) => {
  // Validate the ID before proceeding with the deletion
  if (isNaN(id)) {
    console.log("Invalid ID. Please provide a numeric ID.");
    return;
  }

  // Check if the diary.json file exists; if not, display a message and return
  if (!fs.existsSync("diary.json")) {
    console.log("No diary entries found.");
    return;
  }

  const data = fs.readFileSync("diary.json", "utf-8"); // Read existing diary entries from the file
  const diaryEntries = JSON.parse(data); // Parse the JSON data into an array

  const entryIndex = diaryEntries.findIndex((entry) => entry.id === id); // Find the index of the entry with the specified ID
  // If no entry is found with the specified ID, display a message and return
  if (entryIndex === -1) {
    console.log(`No diary entry found with ID ${id}.`);
    return;
  }

  diaryEntries.splice(entryIndex, 1); // Remove the entry from the array
  fs.writeFileSync("diary.json", JSON.stringify(diaryEntries, null, 2)); // Write the updated entries back to the file
  console.log(`Diary entry with ID ${id} deleted successfully!`);
};

/**
 * Displays all diary entries stored in the diary file. The function checks if the diary file exists and reads its contents.
 * If the file does not exist or contains no entries, it displays a message indicating that no diary entries are found. Otherwise,
 * it parses the JSON data and iterates through each diary entry, displaying its ID, date, timestamp, and entry text in a formatted manner.
 * @returns {void}
 */
const viewDiaryEntries = () => {
  // Check if the diary.json file exists; if not, display a message and return
  if (!fs.existsSync("diary.json")) {
    console.log("No diary entries found.");
    return;
  }

  const data = fs.readFileSync("diary.json", "utf-8"); // Read diary entries from the file
  const diaryEntries = JSON.parse(data); // Parse the JSON data into an array

  // If no diary entries are found, display a message and return
  if (diaryEntries.length === 0) {
    console.log("No diary entries found.");
    return;
  }

  console.log("Diary Entries:");

  // Display each diary entry with its ID, date, timestamp, and entry text
  diaryEntries.forEach((entry) => {
    console.log(`ID: ${entry.id}`);
    console.log(`Date: ${entry.date}`);
    console.log(`Timestamp: ${entry.timestamp}`);
    console.log(`Entry: ${entry.entry}`);
    console.log("-------------------------");
  });
};

/**
 * Searches for diary entries containing a specific keyword.
 * The function checks if the diary file exists and reads its contents.
 * If the file does not exist, it displays a message indicating that no diary entries are found.
 * Otherwise, it parses the JSON data and filters the diary entries to find those that contain the specified keyword (case-insensitive).
 * If no matching entries are found, it displays a message indicating that no matching diary entries are found.
 * Otherwise, it displays the matching entries with their ID, date, timestamp, and entry text in a formatted manner.
 * @param {string} keyword - The keyword to search for
 * @returns {void}
 */
const searchDiaryEntries = (keyword) => {
  // Check if the diary.json file exists; if not, display a message and return
  if (!fs.existsSync("diary.json")) {
    console.log("No diary entries found.");
    return;
  }
  const data = fs.readFileSync("diary.json", "utf-8"); // Read diary entries from the file
  const diaryEntries = JSON.parse(data); // Parse the JSON data into an array
  // Filter entries that contain the keyword (case-insensitive)
  const matchingEntries = diaryEntries.filter(
    (entry) => entry.entry.toLowerCase().includes(keyword.toLowerCase()), // Check if the entry contains the keyword (case-insensitive)
  );
  // If no matching entries are found, display a message and return
  if (matchingEntries.length === 0) {
    console.log("No matching diary entries found.");
    return;
  }
  console.log(`Found ${matchingEntries.length} matching entries:`);
  // Display the matching entries with their ID, date, timestamp, and entry text
  matchingEntries.forEach((entry) => {
    console.log(`ID: ${entry.id}`);
    console.log(`Date: ${entry.date}`);
    console.log(`Timestamp: ${entry.timestamp}`);
    console.log(`Entry: ${entry.entry}`);
    console.log("-------------------------");
  });
};

/**
 * Displays a help message with usage instructions for the diary application.
 * The message provides information on how to use the different commands (add, view, search, help)
 * and the required flags for each command.
 */
const helpMessage = `Usage:
  node diary.js add --entry "Your diary entry text here"
  node diary.js update --id "Entry ID" --entry "Updated diary entry text here"
  node diary.js delete --id "Entry ID"
  node diary.js view
  node diary.js search --keyword "Your search keyword here"
  node diary.js help`;

/**
 * Main command handling logic that checks the provided command and executes the corresponding function.
 * If the command is "add", it checks for the presence of the diary entry text and calls the addDiaryEntry function.
 * If the command is "view", it calls the viewDiaryEntries function to display all diary entries.
 * If the command is "search", it checks for the presence of the search keyword and calls the searchDiaryEntries function.
 * If the command is "help", it displays the help message. If an invalid command is provided, it displays an error message.
 * @returns {void}
 */
if (command === "add") {
  // Check if the diary entry text is provided; if not, display a message and exit
  if (!sentence) {
    console.log("Please provide a diary entry text using the --entry flag.");
    process.exit(1); // Exit the process with a non-zero status code to indicate an error
  }
  addDiaryEntry(sentence); // Call the function to add a new diary entry with the provided text
} else if (command === "view") {
  viewDiaryEntries(); // Call the function to view all diary entries
} else if (command === "search") {
  // Check if the search keyword is provided; if not, display a message and exit
  if (!keyword) {
    console.log("Please provide a search keyword using the --keyword flag.");
    process.exit(1);
  }
  searchDiaryEntries(keyword); // Call the function to search for diary entries containing the provided keyword
} else if (command === "help") {
  console.log(helpMessage);
} else if (command === "update") {
  // Check if the entry ID and new entry text are provided; if not, display a message and exit
  if (!id || !newEntry) {
    console.log(
      "Please provide an entry ID and updated diary entry text using the --id and --entry flags.",
    );
    process.exit(1);
  }
  updateDiaryEntry(id, newEntry); // Call the function to update the specified diary entry
} else if (command === "delete") {
  // Check if the entry ID is provided; if not, display a message and exit
  if (!id) {
    console.log("Please provide an entry ID using the --id flag.");
    process.exit(1);
  }
  deleteDiaryEntry(id); // Call the function to delete the specified diary entry
} else {
  console.log("Invalid command. Use 'add' to add a new diary entry.");
}
