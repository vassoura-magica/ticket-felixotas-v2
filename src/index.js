require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const requiredEnv = ['BOT_TOKEN', 'CLIENT_ID'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// Load slash commands from src/commands.
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));

  if (!command.data || !command.execute) {
    console.warn(`Skipped command file ${file}: missing data or execute.`);
    continue;
  }

  client.commands.set(command.data.name, command);
}

// Load event handlers from src/events.
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));

  if (!event.name || !event.execute) {
    console.warn(`Skipped event file ${file}: missing name or execute.`);
    continue;
  }

  client.on(event.name, (...args) => event.execute(...args, client));
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
