import Tesseract from 'tesseract.js';
import { writeFile, unlink } from 'fs/promises';

const givetextCommand = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.split(' ').slice(1); 

  const validCommands = ['givetext', 'extract'];

  if (validCommands.includes(cmd)) {
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`Send/Reply with an image to extract text ${prefix + cmd}`);
    }

    let lang = 'eng'; 
    if (args.length > 0) {
      lang = args[0]; 
    }

    try {
      const media = await m.quoted.download(); 
      if (!media) throw new Error('Failed to download media.');

      const filePath = `./${Date.now()}.png`;
      await writeFile(filePath, media);

      const { data: { text } } = await Tesseract.recognize(filePath, lang, {
        logger: m => console.log(m)
      });

      const responseMessage = `Extracted Text:\n\n${text}`;
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m }); 

      await unlink(filePath); 
    } catch (error) {
      console.error("Error extracting text from image:", error);
      await Matrix.sendMessage(m.from, { text: 'Error extracting text from image.' }, { quoted: m }); 
    }
  }
};

export default givetextCommand;
