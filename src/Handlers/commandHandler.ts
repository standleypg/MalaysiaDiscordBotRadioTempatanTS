import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  VoiceChannel,
} from "discord.js";
import { helpMessage } from "../Constants/helpMessage";
import { InitiateVoiceChannel } from "./initiator";
import { DestroyVoiceChannel } from "./dispossal";
import ytsr from "ytsr";
import { RadiosButtonRows } from "../Constants/radio-button-data";
import { onPlaylistChanged, playlist } from "../playlist";

export async function commandHandler(
  command: string,
  message: Message<boolean>
) {
  if (command === "help") {
    await message.reply(helpMessage);
  }

  if (command === "tutup") {
    await message.reply(
      await DestroyVoiceChannel(message.member?.voice.channel as VoiceChannel)
    );
  }

  if(command.startsWith("playlist")) {
    await  message.reply(`Playlist: ${playlist.map((song) => song.url).join("\n")}`);
  }

  if (command.startsWith("next")) {
    playlist.shift();
    await onPlaylistChanged(message);
  }

  if (command.startsWith("pasang")) {
    const commandQuery = message.content.slice(8);
    let uri: URL | null = null; // Initialize to null

    try {
      uri = new URL(commandQuery);
    } catch (error) {
      // Handle the error if the URL cannot be created.
      console.error("Invalid URL: " + commandQuery);
    }

    if (uri) {
      await InitiateVoiceChannel<Message>(
        message.content.split(" ")[1],
        message,
        message.member?.voice.channel as VoiceChannel,
        true
      );
    } else if (commandQuery === "radio") {
      const row: any = new ActionRowBuilder().addComponents(RadiosButtonRows());

      // Send the message with the action row
      await message.reply({
        content: "Pilih radio kedeka ati nuan:",
        components: [row],
      });
    } else {
      try {
        const searchResults = await ytsr(commandQuery, { limit: 5 });

        if (searchResults.items.length === 0) {
          message.reply("Nadai ulih digiga utai ditaip nuan kaban. Taip baru.");
          return;
        }

        const rows: any = searchResults.items.map((result: any, index: any) => {
          const button = new ButtonBuilder()
            .setCustomId(`${result.url}`)
            .setLabel(`${index + 1}. ${result.title.slice(0, 70)}`)
            .setStyle(ButtonStyle.Primary);

          return new ActionRowBuilder().addComponents(button);
        });

        message.reply({
          content: "Pilih lagu deka dipasang nuan kaban:",
          components: rows,
        });
      } catch (error) {
        console.error(error);
        message.reply("Bisi error ngiga lagu ba YouTube tu kaban.");
      }
    }
  }
}
