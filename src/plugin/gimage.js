import axios from 'axios';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const imageCommand = async (m, sock) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  let query = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['image', 'img', 'gimage'];

  if (validCommands.includes(cmd)) {
  
    if (!query && !(m.quoted && m.quoted.text)) {
      return sock.sendMessage(m.from, { text: `Please provide some text, Example usage: ${prefix + cmd} black cats` });
    }
  
    if (!query && m.quoted && m.quoted.text) {
      query = m.quoted.text;
    }

    const numberOfImages = 5; 

    try {
      await sock.sendMessage(m.from, { text: '*Please wait*' });

      const images = [];

      for (let i = 0; i < numberOfImages; i++) {
        const endpoint = `https://api.guruapi.tech/api/googleimage?text=${encodeURIComponent(query)}`;
        const response = await axios.get(endpoint, { responseType: 'arraybuffer' });

        if (response.status === 200) {
          const imageBuffer = Buffer.from(response.data, 'binary');
          images.push(imageBuffer);
        } else {
          throw new Error('Image generation failed');
        }
      }

      for (let i = 0; i < images.length; i++) {
        await sleep(500);
        await sock.sendMessage(m.from, { image: images[i], caption: '' }, { quoted: m });
      }
      await m.React("✅");
    } catch (error) {
      console.error("Error fetching images:", error);
      await sock.sendMessage(m.from, { text: '*Oops! Something went wrong while generating images. Please try again later.*' });
    }
  }
};

export default imageCommand;
