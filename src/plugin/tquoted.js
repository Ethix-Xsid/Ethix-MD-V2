const quotedMessage = async (m, gss) => {
try {
const prefixMatch = m.body.match(/^[/!#.]/);
const prefix = prefixMatch ? prefixMatch[0] : '/';
const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim().toLowerCase() : '';
const validCommands = ['q', 'quoted'];

if (validCommands.includes(cmd)) {
if (!m.quoted) return m.reply('Please reply to a message!');
if (!m.quoted || !m.quoted.quoted) return m.reply('The replied message does not contain a reply');
const quotedMsg = await m.getQuotedMsg();
if (!quotedMsg) return m.reply('The replied message does not contain a reply');
await quotedMsg.copyForward(m.from, true);
}
} catch (err) {
console.error(err);
}
};

export default quotedMessage;