const https = require("https");
var cron = require('node-cron');
const TelegramBot = require('node-telegram-bot-api');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const token = 'YOUR_TOKEN';
const options = {
    ignoreAttributes: false,
    attributeNamePrefix : "@_",
};
const fs = require("fs");
const minutes = 10; //Cycle minutes

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

//Get Data from Url
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

//Cron Scheduler
cron.schedule('*/'+minutes+' * * * *', () => {
    get_xml();
});

//Prepare Message for the Group
async function get_xml() {
    //Read Txt File with Id
    var array = fs.readFileSync('YOUR_FILE.txt').toString().split("\n");
    for (i = 0; i < array.length; i++) {
      array[i] = parseInt(array[i])
    }
    //Read remote Xml
    var fileURL = 'YOUR_XML_PATH';
    const xmlDataStr = await httpGet(fileURL);
    const parser = new XMLParser(options);
    const output = parser.parse(xmlDataStr);
    var elements = output.YOUR_DATA;
    var len = elements.length;
    var text = '';
    for (var i = 0; i < len; i++) {
      if (array.indexOf(parseInt(elements[i].id)) == -1) {
        text += ord[i]['field1'];
        text += ord[i]['field2'];
        ...
        text += '\n';
        fs.appendFileSync('YOUR_FILE.txt', "\n"+elements[i].id.toString());
      }
    }
    if (text != '')
        bot.sendMessage(YOUR_TELEGRAM_GROUP_ID, text, {parse_mode: 'HTML'});
}
