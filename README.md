# Telegram News Bot

This Node.js script fetches news updates from an XML feed and sends them to a designated Telegram group. It ensures that only new updates are sent by keeping track of previously sent news IDs in a local file.

## Prerequisites
Before running this script, you need:

1. A **Telegram bot token**, which you can obtain by creating a bot through [BotFather](https://t.me/botfather) on Telegram.
2. The **Telegram group ID** where the bot will send messages. To get your group ID:
   - Add the bot to the group.
   - Send a message to the group.
   - Use an API call: `https://api.telegram.org/botYOUR_TOKEN/getUpdates` to fetch the chat ID.

## Installation

Ensure you have Node.js installed, then install the required dependencies:
```sh
npm install node-telegram-bot-api node-cron fast-xml-parser
```

## How It Works
### 1. Polling Technique
The bot uses **polling** to continuously fetch updates, rather than using webhooks. This ensures real-time data retrieval without requiring a public server.

### 2. Tracking Sent News
A text file (`YOUR_FILE.txt`) is used to store previously sent news IDs. Before sending a new update, the script checks if the ID already exists in the file to prevent duplicate messages.

### 3. Fetching & Parsing XML Data
The script retrieves the XML file from a specified URL, parses it, and extracts the required news fields.

### 4. Scheduled Execution (Cron Jobs)
The script runs every 10 minutes using `node-cron`. This interval can be adjusted in the configuration:
```js
const minutes = 10; // Cycle interval in minutes
```
To ensure the script keeps running even after system reboots or crashes, it is recommended to use **PM2**:
```sh
npm install pm2 -g
pm2 start script.js --name telegram-news-bot
pm2 save
pm2 startup
```

## Code Breakdown
```js
const https = require("https");
const cron = require('node-cron');
const TelegramBot = require('node-telegram-bot-api');
const { XMLParser } = require("fast-xml-parser");
const fs = require("fs");

const token = 'YOUR_TOKEN'; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });
const minutes = 10; // Frequency of execution

// Function to fetch XML data
const httpGet = url => {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
        }).on('error', reject);
    });
};

// Scheduled task
cron.schedule('*/' + minutes + ' * * * *', () => {
    get_xml();
});

// Function to parse and send new updates
async function get_xml() {
    // Read previously sent IDs
    var sentIds = fs.readFileSync('YOUR_FILE.txt', 'utf8').split("\n").map(Number);
    
    // Fetch XML data
    var fileURL = 'YOUR_XML_PATH'; // Set the XML feed URL
    const xmlDataStr = await httpGet(fileURL);
    const parser = new XMLParser();
    const output = parser.parse(xmlDataStr);
    
    var elements = output.YOUR_DATA;
    var text = '';
    
    for (var i = 0; i < elements.length; i++) {
        if (!sentIds.includes(parseInt(elements[i].id))) {
            text += `${elements[i].field1}\n${elements[i].field2}\n\n`;
            fs.appendFileSync('YOUR_FILE.txt', `\n${elements[i].id}`);
        }
    }
    
    if (text !== '') {
        bot.sendMessage(YOUR_TELEGRAM_GROUP_ID, text, { parse_mode: 'HTML' });
    }
}
```

## Customization
- **Change the XML feed URL**: Update `YOUR_XML_PATH` with the actual XML feed URL.
- **Modify the extracted fields**: Adjust `field1`, `field2`, etc., according to the XML structure.
- **Change the execution interval**: Modify the `minutes` variable to adjust the frequency.
- **Set the Telegram group ID**: Replace `YOUR_TELEGRAM_GROUP_ID` with the actual group ID.

## Running the Script
Start the script manually:
```sh
node script.js
```
Or run it continuously with PM2:
```sh
pm2 start script.js --name telegram-news-bot
pm2 save
```

## Conclusion
This bot efficiently monitors an XML feed for updates and automatically notifies a Telegram group. By using polling, a local tracking file, and cron scheduling, it ensures reliability and avoids redundant messages. Using PM2 guarantees that the script stays running even in case of system restarts.

