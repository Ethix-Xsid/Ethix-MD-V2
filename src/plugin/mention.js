import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import config from '../../config.cjs';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const chatHistoryFile = path.resolve(__dirname, '../tag_history.json');

const mistralSystemPrompt = "You are Ethix-MD, an intelligent bot. Someone mentioned your owner. Respond with helpful and friendly assistance.";

async function readChatHistoryFromFile() {
    try {
        const data = await fs.readFile(chatHistoryFile, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

async function writeChatHistoryToFile(chatHistory) {
    try {
        await fs.writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    } catch (err) {
        console.error('Error writing chat history to file:', err);
    }
}

async function updateChatHistory(chatHistory, sender, message) {
    if (!chatHistory[sender]) {
        chatHistory[sender] = [];
    }
    chatHistory[sender].push(message);
    if (chatHistory[sender].length > 20) {
        chatHistory[sender].shift();
    }
    await writeChatHistoryToFile(chatHistory);
}

async function deleteChatHistory(chatHistory, userId) {
    delete chatHistory[userId];
    await writeChatHistoryToFile(chatHistory);
}

const mistral = async (m, Matrix) => {
    const chatHistory = await readChatHistoryFromFile();
    const botNumber = await Matrix.decodeJid(Matrix.user.id).split('@')[0];
    const ownerNumber = config.OWNER_NUMBER;
    const isBotOrOwnerMentioned = m.body.startsWith(`@${botNumber}`) || m.body.startsWith(`@${ownerNumber}`);

    if (m.body.toLowerCase() === "/forget") {
        await deleteChatHistory(chatHistory, m.sender);
        await Matrix.sendMessage(m.from, { text: 'Conversation deleted successfully' }, { quoted: m });
        return;
    }

    if (isBotOrOwnerMentioned) {
        const text = m.body.trim();

        if (text === `@${botNumber}` || text === `@${ownerNumber}`) {
            await Matrix.sendMessage(m.from, { audio: { url: 'https://telegra.ph/file/2d742503794850627fbdd.mp4' } }, { quoted: m });
            return;
        }

        const strippedText = text.replace(`@${botNumber}`, '').replace(`@${ownerNumber}`, '').trim();

        if (strippedText) {
            try {
                const senderChatHistory = chatHistory[m.sender] || [];
                const messages = [
                    { role: "system", content: mistralSystemPrompt },
                    ...senderChatHistory,
                    { role: "user", content: strippedText }
                ];

                await m.React("⏳");

                const response = await fetch('https://matrixcoder.tech/api/ai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: "text-generation",
                        model: "hf/meta-llama/meta-llama-3-8b-instruct",
                        messages: messages
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();

                await updateChatHistory(chatHistory, m.sender, { role: "user", content: strippedText });
                await updateChatHistory(chatHistory, m.sender, { role: "assistant", content: responseData.result.response });

                const answer = responseData.result.response;

                await Matrix.sendMessage(m.from, { text: answer }, { quoted: m });
                await m.React("✅");
            } catch (err) {
                await Matrix.sendMessage(m.from, { text: "Something went wrong" }, { quoted: m });
                console.error('Error: ', err);
                await m.React("❌");
            }
        }
    }
};

export default mistral;
