# Discord Ticket System Bot (discord.js v14)

A professional, modular Discord ticket bot built with **JavaScript** and **discord.js v14**. It provides a slash command panel (`/ticket`) and button-based flow to open and close private support tickets.

## Features

- ✅ Slash command: `/ticket`
- ✅ Professional embed panel with **🎫 Open Ticket** button
- ✅ Private ticket channel creation per user
- ✅ Ticket channel embed with **🔒 Close Ticket** button
- ✅ Permission-based access (ticket owner + support role + bot)
- ✅ Centralized constants and embed builders for maintainability
- ✅ Robust interaction error handling

---

## Project Structure

```txt
src/
  commands/
    ticket.js              # Slash command definition and panel sender
  events/
    interactionCreate.js   # Handles slash commands + button interactions
  utils/
    constants.js           # Shared command/button IDs
    embeds.js              # Reusable embed builders
  deploy-commands.js       # Slash command registration script
  index.js                 # Bot startup and dynamic loader
```

---

## Requirements

- Node.js **18.17+** (recommended Node.js 20 LTS)
- A Discord application + bot token
- Bot invited with proper permissions (`Manage Channels`, `Send Messages`, `View Channels`)

---

## Environment Variables

Create a `.env` file in the root:

```env
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_application_client_id
GUILD_ID=optional_for_guild_command_registration
SUPPORT_ROLE_ID=optional_support_role_id_for_ticket_access
```

### Variable Notes

- `BOT_TOKEN` (required): Your bot token from Discord Developer Portal.
- `CLIENT_ID` (required): Application ID.
- `GUILD_ID` (optional): If set, commands are registered to one guild instantly.
- `SUPPORT_ROLE_ID` (optional): Role that can view/respond in all created tickets.

---

## Installation

```bash
npm install
```

---

## Register Slash Commands

For fast testing (recommended), set `GUILD_ID` in `.env` and run:

```bash
npm run deploy:commands
```

For global registration, remove `GUILD_ID` from `.env` and run the same command.

> Global command updates can take up to ~1 hour to appear.

---

## Run the Bot

```bash
npm start
```

You should see output similar to:

```txt
✅ Logged in as YourBot#0001
```

---

## Basic Usage

1. Moderator/support staff runs `/ticket` in a public support channel.
2. Bot posts an embed panel with **🎫 Open Ticket**.
3. User clicks **🎫 Open Ticket**.
4. Bot creates a private text channel named `ticket-<userId>`.
5. Bot posts ticket embed in that channel with **🔒 Close Ticket**.
6. Ticket owner or support staff closes it with **🔒 Close Ticket**.
7. Bot posts closure message and deletes the channel after 5 seconds.

---

## Hosting Guidance

You can host this bot on:
- VPS (Ubuntu + PM2)
- Railway / Render / Fly.io / similar Node-compatible platforms

### PM2 Example (VPS)

```bash
npm install
npm run deploy:commands
npm install -g pm2
pm2 start src/index.js --name ticket-bot
pm2 save
pm2 startup
```

---

## Discord Permission Checklist

Ensure the bot has:

- View Channels
- Send Messages
- Read Message History
- Manage Channels

Also ensure your support staff has `Manage Channels` **or** provide `SUPPORT_ROLE_ID`.

---

## Notes

- This bot follows Discord API v10 via discord.js v14.
- Buttons are handled through `interactionCreate` using custom IDs.
- Code is intentionally modular for easier scaling (transcripts, logs, categories, etc.).
