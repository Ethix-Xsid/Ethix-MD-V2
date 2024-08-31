import axios from 'axios';

const apiBaseUrl = 'https://www.guruapi.tech/api/igdlv1?url=';

const instaDownload = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['insta', 'ig', 'igdl', 'instadl'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Please provide an Instagram URL.');

    try {
      await m.React('🕘');

      const apiUrl = `${apiBaseUrl}${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result.success && result.data && result.data.length > 0) {
        const mediaUrl = result.data[0].url_download; // Use the first media URL from the array
        const caption = "© Powered By Ethix-MD";

        await Matrix.sendMedia(m.from, mediaUrl, 'file', caption, m);
        await m.React('✅');
      } else {
        throw new Error('Invalid response from the downloader.');
      }
    } catch (error) {
      console.error('Error downloading Instagram media:', error.message);
      m.reply('Error downloading Instagram media.');
      await m.React('❌');
    }
  }
};

export default instaDownload;
