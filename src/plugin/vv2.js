import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs';

const vv2 = async (m, Gifted) => {
  try {
    console.log('Quoted message:', m.quoted); // Logging statement to check the quoted message

    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['rvo2', 'vv2', 'reveal2', 'antiviewonce2', 'viewonce2'];
    if (!validCommands.includes(cmd)) return;

    // Check if the quoted message is a view-once message
    if (!m.quoted || m.quoted.type !== 'view_once' || (m.quoted.mtype !== 'imageMessage' && m.quoted.mtype !== 'videoMessage' && m.quoted.mtype !== 'audioMessage')) {
      return m.reply('This is not a view once message');
    }

    // Extract the message and its type
    const msg = m.quoted.message;
    const type = Object.keys(msg)[0];
    
    const originalCaption = msg[type].caption || '';
    const newCaption = `${originalCaption}\n\n> Ethix-MD-V2 © 2025*`;


    // Download the media content
    const mediaStream = await downloadContentFromMessage(msg[type], type === 'imageMessage' ? 'image' : 'video');
    let buffer = Buffer.from([]);
    for await (const chunk of mediaStream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Send the media back to the chat
    if (/video/.test(type)) {
      await Gifted.sendMessage(m.from, {
        video: buffer,
        caption: newCaption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 9999,
          isForwarded: false,
        }
      }, { quoted: m });
    } else if (/image/.test(type)) {
      await Gifted.sendMessage(m.from, {
        image: buffer,
        caption: newCaption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 9999,
          isForwarded: false,
        }
      }, { quoted: m });
    }
    else if (/audio/.test(type)) {
      await Gifted.sendMessage(botUser, {
        audio: buffer,
        caption: newCaption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 9999,
          isForwarded: false,
        }
      }, { quoted: m });
    }
  } catch (e) {
    console.error('Error:', e);
    m.reply('An error occurred while processing the command.');
  }
};

export default vv2;
