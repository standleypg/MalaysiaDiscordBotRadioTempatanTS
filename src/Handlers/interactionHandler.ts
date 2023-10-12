import { ButtonInteraction, CacheType, VoiceChannel } from "discord.js";
import { Radios } from "../Constants/radio-button-data";
import { InitiateVoiceChannel } from "./voiceChannelInitiator";
import { DestroyVoiceChannel } from "./voiceChannelDispossal";
import { onPlaylistChanged, playlist as playlist } from "../playlist";

export async function InteractionHandler(
  interaction: ButtonInteraction<CacheType>,
  voiceChannel: VoiceChannel
) {
  const { customId } = interaction;

  if (customId.includes("FM")) {
    await interaction.reply(
      `Masang radio ${
        Radios.find((radio) => radio.id === customId)?.id as string
      }`
    );
    InitiateVoiceChannel<ButtonInteraction<CacheType>>(
      Radios.find((radio) => radio.id === customId)?.url as string,
      interaction,
      voiceChannel
    );
  } else {
    //add to playlist
    playlist.push({
      url: customId,
      interaction: interaction,
      voiceChannel: voiceChannel,
      isYoutube: true,
    });

    await interaction.reply(
      "Added to the playlist. Wait for the current song to finish."
    );
    await onPlaylistChanged();
  }

  if (customId === "tutup") {
    await interaction.reply(await DestroyVoiceChannel(voiceChannel));
  }
}
