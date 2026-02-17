const { EmbedBuilder } = require('discord.js');

/**
 * Build the public ticket panel embed shown in the channel where /ticket is executed.
 */
function buildTicketPanelEmbed(guild) {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setAuthor({
      name: `${guild.name} • Support Center`,
      iconURL: guild.iconURL({ extension: 'png', size: 256 }) || undefined,
    })
    .setTitle('Need help? Open a support ticket')
    .setDescription(
      [
        'Click **🎫 Open Ticket** below to create a private support channel.',
        'A member of the support team will assist you shortly.',
      ].join('\n')
    )
    .setFooter({ text: 'Professional Ticket System • Components v2 ready' })
    .setTimestamp(new Date());
}

/**
 * Build the embed message posted in each new ticket channel.
 */
function buildTicketCreatedEmbed(user) {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setAuthor({
      name: `Ticket opened by ${user.tag}`,
      iconURL: user.displayAvatarURL({ extension: 'png', size: 256 }),
    })
    .setTitle('Support ticket created')
    .setDescription(
      [
        `${user}, thanks for contacting support.`,
        'Please describe your issue in detail and a staff member will assist you.',
        'When your issue is resolved, use **🔒 Close Ticket**.',
      ].join('\n')
    )
    .setFooter({ text: 'Only you and support staff can see this channel.' })
    .setTimestamp(new Date());
}

/**
 * Build an embed used when the ticket is closed.
 */
function buildTicketClosedEmbed(closer) {
  return new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle('Ticket closed')
    .setDescription(`This ticket has been closed by ${closer}.`)
    .setFooter({ text: 'Channel deletion in 5 seconds...' })
    .setTimestamp(new Date());
}

module.exports = {
  buildTicketPanelEmbed,
  buildTicketCreatedEmbed,
  buildTicketClosedEmbed,
};
