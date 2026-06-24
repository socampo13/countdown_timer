Countdown Timer
A clean, vanilla JavaScript countdown timer application that counts down the days, hours, minutes, and seconds until a user-defined event. No external libraries or packages required.

🎯 Features
Core Features
Event Configuration: Set an event name, date, and optional time

Live Countdown: Real-time decrementing display showing days, hours, minutes, and seconds

Input Validation: Clear warning messages for:

Blank event names

Invalid date/time formats

Events scheduled too far in the future (overflow protection)

Past events

Automatic Progression: Seconds roll over to minutes, minutes to hours, and hours to days

Responsive Design: Works on desktop and mobile devices

Bonus Features
Event Persistence: Save events that persist across browser sessions using localStorage

Event Reached Alert: Browser alert notification when the countdown reaches zero

Reset Functionality: Clear the current countdown with one click

Saved Event Management: Load, save, and clear saved events


💻 Installation

Option 1: Direct Download
Download the index.html, styles.css and script.js files and open it in your browser.


🎮 Usage
Basic Usage
Enter Event Details

Event Name: e.g., "Birthday", "Anniversary", "New Year"

Date: Select a future date using the date picker

Time (Optional): Set a specific time; defaults to midnight (00:00)

Start Countdown

Click the "Start" button

The countdown will begin displaying in real-time

Monitor Progress

Watch the days, hours, minutes, and seconds decrement

Units automatically roll over (e.g., 59 seconds → 0 seconds, minutes decrease by 1)

Reset

Click the "↺" button to stop the countdown and clear the display

Saved Events
Save Event: Click "💾 Save event" to store the current event in your browser

Load Saved: Saved events automatically load when you reopen the page

Clear Saved: Use "🗑️ Clear saved" to remove the stored event

🛠️ Technical Details
Technologies Used
HTML5: Semantic markup

CSS3: Custom styling with backdrop blur effects and gradients

Vanilla JavaScript: No external dependencies or libraries

Key Implementation Details
Date Handling
Uses native JavaScript Date objects for all calculations

No external dependencies

🌐 Browser Support
Browser	Version	Support
Chrome	60+	✅ Full
Firefox	55+	✅ Full
Safari	12+	✅ Full
Edge	79+	✅ Full
Opera	47+	✅ Full
iOS Safari	12+	✅ Full
Android Chrome	60+	✅ Full


Test in multiple browsers

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

Made with ❤️ and Vanilla JavaScript

Supports date and time inputs via HTML5 input types

Handles timezone awareness through local time zone detection
