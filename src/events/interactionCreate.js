const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const { BUTTONS, CHANNEL_NAME_PREFIX } = require('../utils/constants');
const {
  buildTicketCreatedEmbed,
  buildTicketClosedEmbed,
} = require('../utils/embeds');

/**
 * Handle slash commands and button interactions in one place.
 */
module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction);
        return;
      }

      if (!interaction.isButton()) return;

      if (interaction.customId === BUTTONS.OPEN_TICKET) {
        await handleOpenTicket(interaction);
        return;
      }

      if (interaction.customId === BUTTONS.CLOSE_TICKET) {
        await handleCloseTicket(interaction);
      }
    } catch (error) {
      console.error('Interaction handler error:', error);

      const message = {
        content: '⚠️ Something went wrong while handling that interaction.',
        ephemeral: true,
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(message).catch(() => null);
      } else {
        await interaction.reply(message).catch(() => null);
      }
    }
  },
};

/**
 * Creates a private ticket channel for the clicking user.
 */
async function handleOpenTicket(interaction) {
  if (!interaction.guild) {
    await interaction.reply({
      content: 'This button can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const existingChannel = interaction.guild.channels.cache.find(
    (channel) =>
      channel.name === `${CHANNEL_NAME_PREFIX}-${interaction.user.id}` &&
      channel.type === ChannelType.GuildText
  );

  if (existingChannel) {
    await interaction.reply({
      content: `You already have an open ticket: ${existingChannel}`,
      ephemeral: true,
    });
    return;
  }

  const botMember = interaction.guild.members.me;
  const canManageChannels = botMember?.permissions.has(PermissionFlagsBits.ManageChannels);

  if (!canManageChannels) {
    await interaction.reply({
      content: 'I need the **Manage Channels** permission to create tickets.',
      ephemeral: true,
    });
    return;
  }

  const supportRoleId = process.env.SUPPORT_ROLE_ID;

  const permissionOverwrites = [
    {
      id: interaction.guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    },
    {
      id: interaction.client.user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageChannels,
      ],
    },
  ];

  if (supportRoleId) {
    permissionOverwrites.push({
      id: supportRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    });
  }

  const ticketChannel = await interaction.guild.channels.create({
    name: `${CHANNEL_NAME_PREFIX}-${interaction.user.id}`,
    type: ChannelType.GuildText,
    permissionOverwrites,
    topic: `Support ticket for ${interaction.user.tag} (${interaction.user.id})`,
  });

  const closeButton = new ButtonBuilder()
    .setCustomId(BUTTONS.CLOSE_TICKET)
    .setLabel('🔒 Close Ticket')
    .setStyle(ButtonStyle.Danger);

  const closeRow = new ActionRowBuilder().addComponents(closeButton);

  await ticketChannel.send({
    content: supportRoleId ? `<@&${supportRoleId}> ${interaction.user}` : `${interaction.user}`,
    embeds: [buildTicketCreatedEmbed(interaction.user)],
    components: [closeRow],
  });

  await interaction.reply({
    content: `✅ Ticket created: ${ticketChannel}`,
    ephemeral: true,
  });
}

/**
 * Closes a ticket by deleting the current channel after a short delay.
 */
async function handleCloseTicket(interaction) {
  const isTicketChannel = interaction.channel?.name?.startsWith(`${CHANNEL_NAME_PREFIX}-`);

  if (!isTicketChannel) {
    await interaction.reply({
      content: 'This button can only be used in a ticket channel.',
      ephemeral: true,
    });
    return;
  }

  const canClose =
    interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels) ||
    interaction.channel.name === `${CHANNEL_NAME_PREFIX}-${interaction.user.id}`;

  if (!canClose) {
    await interaction.reply({
      content: 'Only support staff or the ticket owner can close this ticket.',
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({
    embeds: [buildTicketClosedEmbed(interaction.user)],
  });

  setTimeout(async () => {
    await interaction.channel.delete('Ticket closed via close button.').catch(() => null);
  }, 5_000);
}
