import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const reminiPath = path.resolve(__dirname, '../remini.cjs');
const { remini } = require(reminiPath);

const tourl = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['hdr', 'hd', 'remini', 'enhance', 'upscale'];

  if (validCommands.includes(cmd)) {
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`*Send/Reply with an Image to Enhance Your Picture Quality ${prefix + cmd}*`);
    }
    
    const media = await m.quoted.download();

    try {
        let proses = await remini(media, "enhance"); // Call remini directly
        gss.sendMessage(m.from, { image: proses, caption: `> *Hey ${m.pushName} Here Is Your Enhanced Image By Ethix-MD*` }, { quoted: m });
      
    } catch (error) {
      console.error('Error processing media:', error);
      m.reply('Error processing media.');
    }
  }
};

export default tourl;
