import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
import Jimp from 'jimp';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const timeString = `${String(days).padStart(2, '0')}-${String(hours).padStart(2, '0')}-${String(minutes).padStart(2, '0')}-${String(seconds).padStart(2, '0')}`;
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (['alive', 'uptime', 'runtime'].includes(cmd)) {
    const width = 800;
    const height = 500;
    const image = new Jimp(width, height, 'black');
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    const textMetrics = Jimp.measureText(font, timeString);
    const textHeight = Jimp.measureTextHeight(font, timeString, width);
    const x = (width / 2) - (textMetrics / 2);
    const y = (height / 2) - (textHeight / 2);
    image.print(font, x, y, timeString, width, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
    const uptimeMessage = `*🤖 ETHIX-MD Status Overview*
_________________________________________

*📆 ${days} Day(s)*
*🕰️ ${hours} Hour(s)*
*⏳ ${minutes} Minute(s)*
*⏲️ ${seconds} Second(s)*
_________________________________________
`;
    
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "MENU",
          id: `${prefix}menu`
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "PING",
          id: `${prefix}ping`
        })
      }
    ];

    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: uptimeMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© ᴘᴏᴡᴇʀᴅ ʙʏ ᴇᴛʜɪx-ᴍᴅ"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({ image: buffer }, { upload: Matrix.waUploadToServer })),
              title: ``,
              gifPlayback: false,
              subtitle: "",
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons
            }),
            contextInfo: {
              quotedMessage: m.message,
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363249960769123@newsletter',
                newsletterName: "Ethix-MD",
                serverMessageId: 143
              }
            }
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default alive;
