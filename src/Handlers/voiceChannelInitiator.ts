import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  ButtonInteraction,
  CacheType,
  Message,
  VoiceChannel,
} from "discord.js";
import ytdl from "ytdl-core";
import { onPlaylistChanged, playlist } from "../playlist";

export async function InitiateVoiceChannel<
  T extends ButtonInteraction<CacheType> | Message
>(url: string, arg: T, voiceChannel: VoiceChannel, isYoutube = false) {
  let isMessage = false;

  if ((arg as any) instanceof Message) {
    isMessage = true;
  }

  try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    let stream: any;
    if (isYoutube) {
      stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
    }

    const audioResource = createAudioResource(isYoutube ? stream : url, {
      inlineVolume: true,
    });

    const audioPlayer = createAudioPlayer(
      isYoutube
        ? {
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause,
            },
          }
        : undefined
    );

    audioPlayer.play(audioResource);

    connection.subscribe(audioPlayer);
    audioPlayer.on(AudioPlayerStatus.Idle, async () => {
      playlist.shift();
      await onPlaylistChanged();
      if (playlist.length === 0) connection.destroy();
    });
  } catch (error) {
    console.error(error);
    const msg = "Apu neh, bisi penanggul maya deka masang radio tu kaban.";
    if (isMessage) {
      await (arg as Message).reply(msg);
    } else {
      await (arg as ButtonInteraction<CacheType>).reply(msg);
    }
  }
}
