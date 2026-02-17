const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { BUTTONS } = require('../utils/constants');
const { buildTicketPanelEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Send the support ticket panel in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  /**
   * Sends the ticket panel embed with the open-ticket button.
   */
  async execute(interaction) {
    const openTicketButton = new ButtonBuilder()
      .setCustomId(BUTTONS.OPEN_TICKET)
      .setLabel('🎫 Open Ticket')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(openTicketButton);

    await interaction.reply({
      embeds: [buildTicketPanelEmbed(interaction.guild)],
      components: [row],
    });
  },
};
