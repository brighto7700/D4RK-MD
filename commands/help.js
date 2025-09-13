const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Format uptime properly
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

// Format RAM usage
function formatRam(total, free) {
    const used = (total - free) / (1024 * 1024 * 1024);
    const totalGb = total / (1024 * 1024 * 1024);
    const percent = ((used / totalGb) * 100).toFixed(1);
    return `${used.toFixed(1)}GB / ${totalGb.toFixed(1)}GB (${percent}%)`;
}

// Count total commands
function countCommands() {
    return 158; // Replace with actual command count
}

// Get mood emoji based on time
function getMoodEmoji() {
    const hour = getLagosTime().getHours();
    if (hour < 12) return '🌅';
    if (hour < 18) return '☀️';
    return '🌙';
}

// Get countdown to next day
function getCountdown() {
    const now = getLagosTime();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `(${hours}h ${minutes}m)`;
}

// Get current time in Africa/Lagos timezone
function getLagosTime() {
    try {
        // Try using Intl API for proper timezone handling
        const options = {
            timeZone: 'Africa/Lagos',
            hour12: false,
            hour: 'numeric',
            minute: 'numeric'
        };
        
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(new Date());
        
        const hour = parts.find(part => part.type === 'hour').value;
        const minute = parts.find(part => part.type === 'minute').value;
        
        // Create a new Date object with the correct time
        const now = new Date();
        const lagosDate = new Date(now.toLocaleString('en-US', {timeZone: 'Africa/Lagos'}));
        
        return lagosDate;
    } catch (error) {
        // Fallback for environments without Intl API support
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        // Africa/Lagos is UTC+1
        return new Date(utc + (3600000 * 1));
    }
}

// Format time specifically for Africa/Lagos
function formatLagosTime() {
    const lagosTime = getLagosTime();
    const hours = lagosTime.getHours().toString().padStart(2, '0');
    const minutes = lagosTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
┌ ❏ * ⌜ʟᴀᴅʏʙᴇʟʟᴀ ᴠ3  ⌟* ❏ 
│
├◆ ᴏᴡɴᴇʀ: ${settings.botOwner || 'sɴᴏᴡʙɪʀᴅ'}
├◆ ᴘʀᴇғɪx: .
├◆ ᴜsᴇʀ: ${message.pushName}
├◆ ᴘʟᴀɴ: Premium ${'✓'}
├◆ ᴠᴇʀsɪᴏɴ: ${settings.version || '3.0.0'}
├◆ ᴛɪᴍᴇ: ${formatLagosTime()} (Africa/Lagos)
├◆ ᴜᴘᴛɪᴍᴇ: ${formatUptime(process.uptime())}
├◆ ᴄᴏᴍᴍᴀɴᴅs: ${countCommands()}
├◆ ᴛᴏᴅᴀʏ: ${new Date().toLocaleDateString('en-US', {weekday: 'long'})}
├◆ ᴅᴀᴛᴇ: ${new Date().toLocaleDateString('en-GB')}
├◆ ᴘʟᴀᴛғᴏʀᴍ: Chrome Ubuntu
├◆ ʀᴜɴᴛɪᴍᴇ: Node.js v${process.version.replace('v', '')}
├◆ ᴄᴘᴜ: ${os.cpus()[0].model.split(' ')[0]} ${os.cpus()[0].speed}MHz
├◆ ʀᴀᴍ: ${formatRam(os.totalmem(), os.freemem())}
├◆ ᴍᴏᴅᴇ: ${settings.commandMode || 'Public'}
├◆ ᴍᴏᴏᴅ: ${getMoodEmoji()} ${getCountdown()}
├◆
┗━━━━━━━━━━━━━━━━━━━━
‎
ʟᴀᴅʏʙᴇʟʟᴀ ᴠ3 ʙᴏᴛ ᴄᴍᴅs

╭─❏  ᴏᴡɴᴇʀ ᴍᴇɴᴜ  ❏─╮
✞︎ .ᴍᴏᴅᴇ <ᴘᴜʙʟɪᴄ/ᴘʀɪᴠᴀᴛᴇ>
✞︎ .ᴄʟᴇᴀʀsᴇssɪᴏɴ
✞︎ .ᴀɴᴛɪᴅᴇʟᴇᴛᴇ
✞︎ .ᴄʟᴇᴀʀᴛᴍᴘ
✞︎ .ᴜᴘᴅᴀᴛᴇ
✞︎ .sᴇᴛᴘᴘ <ʀᴇᴘʟʏ ɪᴍᴀɢᴇ>
✞︎ .ᴀᴜᴛᴏʀᴇᴀᴄᴛ <ᴏɴ/ᴏꜰꜰ>
✞︎ .ᴀᴜᴛᴏsᴛᴀᴛᴜs <ᴏɴ/ᴏꜰꜰ>
✞︎ .ᴀᴜᴛᴏsᴛᴀᴛᴜs ʀᴇᴀᴄᴛ <ᴏɴ/ᴏꜰꜰ>
✞︎ .ᴀᴜᴛᴏᴛʏᴘɪɴɢ <ᴏɴ/ᴏꜰꜰ>
✞︎ .ᴀᴜᴛᴏʀᴇᴀᴅ <ᴏɴ/ᴏꜰꜰ>
✞︎ .ᴀɴᴛɪᴄᴀʟʟ <ᴏɴ/ᴏꜰꜰ>
╰──────────────────╯

╭─❏  ᴀᴅᴍɪɴ ᴄᴏᴍᴍᴀɴᴅs  ❏─╮
✞︎ .ʙᴀɴ @ᴜsᴇʀ
✞︎ .ᴘʀᴏᴍᴏᴛᴇ @ᴜsᴇʀ
✞︎ .ᴅᴇᴍᴏᴛᴇ @ᴜsᴇʀ
✞︎ .ᴍᴜᴛᴇ <ᴍɪɴᴜᴛᴇs>
✞︎ .ᴜɴᴍᴜᴛᴇ
✞︎ .ᴅᴇʟᴇᴛᴇ / .ᴅᴇʟ
✞︎ .ᴋɪᴄᴋ @ᴜsᴇʀ
✞︎ .ᴡᴀʀɴɪɴɢs @ᴜsᴇʀ
✞︎ .ᴡᴀʀɴ @ᴜsᴇʀ
✞︎ .ᴀɴᴛɪʟɪɴᴋ
✞︎ .ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ
✞︎ .ᴄʟᴇᴀʀ
✞︎ .ᴛᴀɢ <ᴍᴇssᴀɢᴇ>
✞︎ .ᴛᴀɢᴀʟʟ
✞︎ .ᴄʜᴀᴛʙᴏᴛ
✞︎ .ʀᴇsᴇᴛʟɪɴᴋ
✞︎ .ᴀɴᴛɪᴛᴀɢ <ᴏɴ/ᴏꜰꜰ>
✞︎ .ᴡᴇʟᴄᴏᴍᴇ <ᴏɴ/ᴏꜰꜰ>
✞︎ .ɢᴏᴏᴅʙʏᴇ <ᴏɴ/ᴏꜰꜰ>
╰──────────────────╯

╭─❏  ɢᴇɴᴇʀᴀʟ ᴍᴇɴᴜ  ❏─╮
✞︎ .sɴᴏᴡʙɪʀᴅ
✞︎ .ᴍᴇɴᴜ
✞︎ .ᴘɪɴɢ
✞︎ .ᴀʟɪᴠᴇ
✞︎ .ᴛᴛs <ᴛᴇxᴛ>
✞︎ .ᴏᴡɴᴇʀ
✞︎ .ᴊᴏᴋᴇ
✞︎ .ǫᴜᴏᴛᴇ
✞︎ .ꜰᴀᴄᴛ
✞︎ .ᴡᴇᴀᴛʜᴇʀ <ᴄɪᴛʏ>
✞︎ .ɴᴇᴡs
✞︎ .ᴀᴛᴛᴘ <ᴛᴇxᴛ>
✞︎ .ʟʏʀɪᴄs <sᴏɴɢ_ᴛɪᴛʟᴇ>
✞︎ .8ʙᴀʟʟ <ǫᴜᴇsᴛɪᴏɴ>
✞︎ .ɢʀᴏᴜᴘɪɴꜰᴏ
✞︎ .sᴛᴀꜰꜰ / .ᴀᴅᴍɪɴs
✞︎ .ᴠᴠ
✞︎ .ᴛʀᴛ <ᴛᴇxᴛ> <ʟᴀɴɢ>
✞︎ .sꜱ <ʟɪɴᴋ>
✞︎ .ᴊɪᴅ
╰──────────────────╯

╭─❏  ɪᴍᴀɢᴇ / sᴛɪᴄᴋᴇʀ  ❏─╮
✞︎ .ʙʟᴜʀ <ɪᴍᴀɢᴇ>
✞︎ .sɪᴍᴀɢᴇ <ʀᴇᴘʟʏ ᴛᴏ sᴛɪᴄᴋᴇʀ>
✞︎ .sᴛɪᴄᴋᴇʀ <ʀᴇᴘʟʏ ᴛᴏ ɪᴍᴀɢᴇ>
✞︎ .ʀᴇᴍᴏᴠᴇʙɢ
✞︎ .ʀᴇᴍɪɴɪ
✞︎ .ᴄʀᴏᴘ <ʀᴇᴘʟʏ ᴛᴏ ɪᴍᴀɢᴇ>
✞︎ .ᴛɢsᴛɪᴄᴋᴇʀ <ʟɪɴᴋ>
✞︎ .ᴍᴇᴍᴇ
✞︎ .ᴛᴀᴋᴇ <ᴘᴀᴄᴋɴᴀᴍᴇ>
✞︎ .ᴇᴍᴏᴊɪᴍɪx <ᴇᴍᴊ1>+<ᴇᴍᴊ2>
✞︎ .ɪɢs <ɪɴsᴛᴀ ʟɪɴᴋ>
✞︎ .ɪɢsᴄ <ɪɴsᴛᴀ ʟɪɴᴋ>
╰──────────────────╯

╭─❏  ᴘɪᴇs ᴍᴇɴᴜ  ❏─╮
✞︎ .ᴘɪᴇs <ᴄᴏᴜɴᴛʀʏ>
✞︎ .ᴄʜɪɴᴀ
✞︎ .ɪɴᴅᴏɴᴇsɪᴀ
✞︎ .ᴊᴀᴘᴀɴ
✞︎ .ᴋᴏʀᴇᴀ
✞︎ .ʜɪᴊᴀʙ
╰──────────────────╯

╭─❏  ɢᴀᴍᴇ ᴍᴇɴᴜ  ❏─╮
✞︎ .ᴛɪᴄᴛᴀᴄᴛᴏᴇ @ᴜsᴇʀ
✞︎ .ʜᴀɴɢᴍᴀɴ
✞︎ .ɢᴜᴇss <ʟᴇᴛᴛᴇʀ>
✞︎ .ᴛʀɪᴠɪᴀ
✞︎ .ᴀɴsᴡᴇʀ <ᴀɴsᴡᴇʀ>
✞︎ .ᴛʀᴜᴛʜ
✞︎ .ᴅᴀʀᴇ
╰──────────────────╯

╭─❏  ᴀɪ / sᴇᴀʀᴄʜ  ❏─╮
✞︎ .ɢᴘᴛ <ǫᴜᴇsᴛɪᴏɴ>
✞︎ .ɢᴇᴍɪɴɪ <ǫᴜᴇsᴛɪᴏɴ>
✞︎ .ɪᴍᴀɢɪɴᴇ <ᴘʀᴏᴍᴘᴛ>
✞︎ .ꜰʟᴜx <ᴘʀᴏᴍᴘᴛ>
╰──────────────────╯

╭─❏  ꜰᴜɴ ᴍᴇɴᴜ  ❏─╮
✞︎ .ᴄᴏᴍᴘʟɪᴍᴇɴᴛ @ᴜsᴇʀ
✞︎ .ɪɴsᴜʟᴛ @ᴜsᴇʀ
✞︎ .ꜰʟɪʀᴛ
✞︎ .sʜᴀʏᴀʀɪ
✞︎ .ɢᴏᴏᴅɴɪɢʜᴛ
✞︎ .ʀᴏsᴇᴅᴀʏ
✞︎ .ᴄʜᴀʀᴀᴄᴛᴇʀ @ᴜsᴇʀ
✞︎ .ᴡᴀsᴛᴇᴅ @ᴜsᴇʀ
✞︎ .sʜɪᴘ @ᴜsᴇʀ
✞︎ .sɪᴍᴘ @ᴜsᴇʀ
✞︎ .sᴛᴜᴘɪᴅ @ᴜsᴇʀ [ᴛᴇxᴛ]
╰──────────────────╯

╭─❏  ᴛᴇxᴛ ᴇꜰꜰᴇᴄᴛs  ❏─╮
✞︎ .ᴍᴇᴛᴀʟʟɪᴄ <ᴛᴇxᴛ>
✞︎ .ɪᴄᴇ <ᴛᴇxᴛ>
✞︎ .sɴᴏᴡ <ᴛᴇxᴛ>
✞︎ .ɪᴍᴘʀᴇssɪᴠᴇ <ᴛᴇxᴛ>
✞︎ .ᴍᴀᴛʀɪx <ᴛᴇxᴛ>
✞︎ .ʟɪɢʜᴛ <ᴛᴇxᴛ>
✞︎ .ɴᴇᴏɴ <ᴛᴇxᴛ>
✞︎ .ᴅᴇᴠɪʟ <ᴛᴇxᴛ>
✞︎ .ᴘᴜʀᴘʟᴇ <ᴛᴇxᴛ>
✞︎ .ᴛʜᴜɴᴅᴇʀ <ᴛᴇxᴛ>
✞︎ .ʟᴇᴀᴠᴇs <ᴛᴇxᴛ>
✞︎ .1917 <ᴛᴇxᴛ>
✞︎ .ᴀʀᴇɴᴀ <ᴛᴇxᴛ>
✞︎ .ʜᴀᴄᴋᴇʀ <ᴛᴇxᴛ>
✞︎ .sᴀɴᴅ <ᴛᴇxᴛ>
✞︎ .ʙʟᴀᴄᴋᴘɪɴᴋ <ᴛᴇxᴛ>
✞︎ .ɢʟɪᴛᴄʜ <ᴛᴇxᴛ>
✞︎ .ꜰɪʀᴇ <ᴛᴇxᴛ>
╰──────────────────╯

╭─❏  ᴅᴏᴡɴʟᴏᴀᴅ  ❏─╮
✞︎ .ᴘʟᴀʏ <sᴏɴɢ_ɴᴀᴍᴇ>
✞︎ .sᴏɴɢ <sᴏɴɢ_ɴᴀᴍᴇ>
✞︎ .ɪɴsᴛᴀɢʀᴀᴍ <ʟɪɴᴋ>
✞︎ .ꜰᴀᴄᴇʙᴏᴏᴋ <ʟɪɴᴋ>
✞︎ .ᴛɪᴋᴛᴏᴋ <ʟɪɴᴋ>
✞︎ .ᴠɪᴅᴇᴏ <sᴏɴɢ_ɴᴀᴍᴇ>
✞︎ .ʏᴛᴍᴘ4 <ʟɪɴᴋ>
╰──────────────────╯

╭─❏  ɢɪᴛʜᴜʙ  ❏─╮
✞︎ .ɢɪᴛ
✞︎ .ɢɪᴛʜᴜʙ
✞︎ .sᴄ
✞︎ .sᴄʀɪᴘᴛ
✞︎ .ʀᴇᴘᴏ
╰──────────────────╯

╭─❏  ᴍɪꜱᴄ ᴍᴇɴᴜ  ❏─╮
✞︎ .ʜᴇᴀʀᴛ
✞︎ .ʜᴏʀɴʏ
✞︎ .ᴄɪʀᴄʟᴇ
✞︎ .ʟɢʙᴛ
✞︎ .ʟᴏʟɪᴄᴇ
✞︎ .ɪᴛs-sᴏ-sᴛᴜᴘɪᴅ
✞︎ .ɴᴀᴍᴇᴄᴀʀᴅ
✞︎ .ᴏᴏɢᴡᴀʏ
✞︎ .ᴛᴡᴇᴇᴛ
✞︎ .ʏᴛᴄᴏᴍᴍᴇɴᴛ
✞︎ .ᴄᴏᴍʀᴀᴅᴇ
✞︎ .ɢᴀʏ
✞︎ .ɢʟᴀss
✞︎ .ᴊᴀɪʟ
✞︎ .ᴘᴀssᴇᴅ
✞︎ .ᴛʀɪɢɢᴇʀᴇᴅ
╰──────────────────╯

╭─❏  ᴀɴɪᴍᴇ  ❏─╮
✞︎ .ɴᴇᴋᴏ
✞︎ .ᴡᴀɪꜰᴜ
✞︎ .ʟᴏʟɪ
✞︎ .ɴᴏᴍ
✞︎ .ᴘᴏᴋᴇ
✞︎ .ᴄʀʏ
✞︎ .ᴋɪss
✞︎ .ᴘᴀᴛ
✞︎ .ʜᴜɢ
✞︎ .ᴡɪɴᴋ
✞︎ .ꜰᴀᴄᴇᴘᴀʟᴍ
╰──────────────────╯

ᴘᴏᴡᴇʀᴇᴅ ʙʏ sɴᴏᴡʙɪʀᴅ`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363399707841760@newsletter',
                        newsletterName: 'ʟᴀᴅʏ ʙᴇʟʟᴀ ᴠ3',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363399707841760@newsletter',
                        newsletterName: 'ʟᴀᴅʏ ʙᴇʟʟᴀ ᴠ3',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
