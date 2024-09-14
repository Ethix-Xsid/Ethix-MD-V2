import axios from 'axios';

const fancyText = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['fancy', 'fancytext'];

  if (validCommands.includes(cmd.split(/\d+/)[0])) {
    const numberMatch = cmd.match(/\d+/);
    const number = numberMatch ? parseInt(numberMatch[0], 10) : null;

    if (!text) {
      await m.reply(`Hello *_${m.pushName}_,*\n Ethix-MD Fancy Text Converter Here.\n Please use .fancy *_your_text_* or .fancy5 *_your_text_* to get a specific style.`);
      return;
    }

    try {
      await m.React('🕘');
      await m.reply('A moment, *Ethix-MD* is Generating Your Fancy Text Styles Request...');

      const apiUrl = `https://gifted-apis-main-4622590b2443.herokuapp.com/api/tools/fancy?text=${encodeURIComponent(text)}&apikey=gifteddevskk`;
      const response = await axios.get(apiUrl);
      const results = response.data.results;

      if (results && results.length > 0) {
        if (number !== null) {
          if (number > 0 && number <= results.length) {
            const selectedResult = results[number - 1].result;
            await Matrix.sendMessage(m.from, { text: `Fancy Text Style ${number}:\n\n${selectedResult}` }, { quoted: m });
          } else {
            await m.reply(`Invalid style number. Please choose a number between 1 and ${results.length}.`);
          }
        } else {
          let formattedResults = 'Fancy Text Styles:\n\n';
          results.forEach((item, index) => {
            if (item.result.trim()) {
              formattedResults += `${index + 1}. ${item.result}\n`;
            }
          });

          if (formattedResults.trim() === 'Fancy Text Styles:') {
            await m.reply('No valid fancy text styles were generated.');
          } else {
            await Matrix.sendMessage(m.from, { text: formattedResults.trim() }, { quoted: m });
          }
        }

        await m.React('✅');
      } else {
        throw new Error('Invalid responseI.');
      }
    } catch (error) {
      console.error('Error getting response:', error.message);
      await m.reply('Error getting response.');
      await m.React('❌');
    }
  }
};

export default fancyText;
