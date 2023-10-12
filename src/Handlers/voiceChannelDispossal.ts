import { getVoiceConnection } from "@discordjs/voice";
import { VoiceChannel } from "discord.js";

export async function DestroyVoiceChannel(
    voiceChannel: VoiceChannel
  ): Promise<string> {
    try {
      const connection = getVoiceConnection(voiceChannel.guild.id);
  
      if (connection) {
        // Stop audio playback
        connection.destroy();
        return `Radio ditutup, bot deka pansut ari voice channel. Bye kaban.`;
      } else {
        return `${name} bot enda ba dalam voice channel.`;
      }
    } catch (error) {
      return `Bisi penanggul maya deka tutup radio tu kaban. Kada ke nuan masang radio kini? Cik dulu kaban.`;
    }
  }
  