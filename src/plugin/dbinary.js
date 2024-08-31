import { dBinary } from '../../lib/binary.cjs';

const dbinary = async (m, gss) => {
const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['dbinary'];

   if (validCommands.includes(cmd)) {
         if (!text) return m.reply('Please provide a text.');
         let db = await dBinary(text)
         m.reply(db)
   }
};

export default dbinary;