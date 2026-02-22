// script.js

// Function to display the current date and time in UTC format
function displayCurrentDateTime() {
    const now = new Date();  // Create a new date object with the current date and time
    const utcDateTime = now.toISOString().replace(/T/, ' ').replace(/Z/, '');  // Convert to UTC format
    console.log(`Current Date and Time (UTC): ${utcDateTime}`);  // Output the UTC date and time
}

// Calling the function to display the date and time
displayCurrentDateTime();