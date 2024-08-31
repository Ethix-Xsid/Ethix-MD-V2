import config from '../../config.cjs';

const leaveGroup = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    const validCommands = ['leave', 'exit', 'left'];

    if (!validCommands.includes(cmd)) return;
    
    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");

    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    await gss.groupLeave(m.from);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default leaveGroup;
