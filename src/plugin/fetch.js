import fetch from 'node-fetch';
import config from '../../config.cjs';

const fetchData = async (m, Matrix) => {
  const prefix = config.PREFIX;
const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['fetch', 'get', 'api'];

  if (validCommands.includes(cmd)) {
    if (!/^https?:\/\//.test(text)) return m.reply('Start the *URL* with http:// or https://');

    try {
      const _url = new URL(text);
      const url = `${_url.origin}${_url.pathname}?${_url.searchParams.toString()}`;
      const res = await fetch(url);

      const contentLength = res.headers.get('content-length');
      if (contentLength && contentLength > 100 * 1024 * 1024 * 1024) {
        return m.reply(`Content-Length exceeds the limit: ${contentLength}`);
      }

      const contentType = res.headers.get('content-type');
      if (!/text|json/.test(contentType)) {
        await Matrix.sendMedia(m.from, url, 'file', '> Api Fetched From Sarkar-AK', m);
        return;
      }

      let content = Buffer.from(await res.arrayBuffer());

      try {
        console.log('Parsed JSON:', JSON.parse(content));
        content = JSON.stringify(JSON.parse(content));
      } catch (e) {
        console.error('Error parsing JSON:', e);
        content = content.toString();
      } finally {
        m.reply(content.slice(0, 65536));
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      m.reply('Error fetching data.');
    }
  }
};

export default fetchData;
