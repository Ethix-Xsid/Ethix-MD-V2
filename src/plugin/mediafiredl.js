import axios from 'axios';
import { Readable } from 'stream';

/**
 * Creates a readable stream from a MediaFire file URL.
 * @param {string} url - The URL of the MediaFire file.
 * @returns {Promise<Readable>} - A promise that resolves with a readable stream.
 */
export async function mediafireDl(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
    });
    const fileStream = response.data;
    const combinedStream = new Readable({
      read() {
        this.push(`Creator: GiftedTech\n`);
        this.push(`Status: 200\n`);
        this.push(`Download_Link: ${url}\n\n`);
        fileStream.pipe(this);
      },
    });

    return combinedStream;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file from MediaFire');
  }
}

const mediafireDownload = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['mediafire', 'mf', 'mfdownload'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Please provide a MediaFire URL.');

    try {
      await m.React('🕘');

      const mediafireUrl = text;
      const fileStream = await mediafireDl(mediafireUrl);

      if (fileStream) {
        const mediaUrl = mediafireUrl;
        const caption = `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇᴛʜɪx-ᴍᴅ\n> File: ${mediafireUrl}\n`;
        const extension = mediaUrl.split('.').pop().toLowerCase();

        await Matrix.sendMedia(m.from, fileStream, extension, caption, m);

        await m.React('✅');
      } else {
        throw new Error('Invalid response from MediaFire.');
      }
    } catch (error) {
      console.error('Error downloading MediaFire file:', error.message);
      m.reply('Error downloading MediaFire file.');
      await m.React('❌');
    }
  }
};

export default mediafireDownload;
