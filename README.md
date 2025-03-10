#Telegram News Bot

This Node.js script fetches news updates from an XML feed and sends them to a designated Telegram group. It ensures that only new updates are sent by keeping track of previously sent news IDs in a local file.

##Prerequisites

Before running this script, you need:

1. A **Telegram bot token**, which you can obtain by creating a bot through BotFather on Telegram.
2. The **Telegram group ID** where the bot will send messages. To get your group ID:
    - Add the bot to the group.
    - Send a message to the group.
    - Use an API call: https://api.telegram.org/botYOUR_TOKEN/getUpdates to fetch the chat ID.
