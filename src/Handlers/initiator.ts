import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  generateDependencyReport,
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
import { Readable } from "stream";

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
    connection.on("stateChange", (oldState, newState) => {
      console.log(
        `Connection transitioned from ${oldState.status} to ${newState.status}`
      );
    });
    let stream: any;
    if (isYoutube) {
      stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
    } else {
      stream = url;
    }

    const streamType = isYoutube ? StreamType.Arbitrary : StreamType.Raw;
    const audioResource = createAudioResource(stream, {
      inlineVolume: true,
      inputType: streamType,
    });
    audioResource.playStream.on("error", (error) => {
      
      console.log("🚀 ~ file: initiator.ts:62 ~ audioResource.playStream.on ~ error:", error);
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

    const subscription = connection.subscribe(audioPlayer);
    console.log(generateDependencyReport());
    audioPlayer.on("stateChange", (oldState, newState) => {
      console.log(
        `Audio player transitioned from ${oldState.status} to ${newState.status}`
      );
    });
    audioPlayer.on(AudioPlayerStatus.AutoPaused, () => {
      console.log("Auto paused");
      // if (subscription) {
      //   console.log("Unsubscribing");
      //   // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
      //   setTimeout(() => subscription.unsubscribe(), 100);
      // }
      // connection.subscribe(audioPlayer);
      // audioPlayer.stop();
      // audioPlayer.play(
      //   createAudioResource(url, {
      //     inlineVolume: true,
      //     inputType: streamType,
      //   })
      // );
      // audioPlayer.unpause();
    });
    audioPlayer.play(audioResource);

    audioPlayer.on(AudioPlayerStatus.Idle, async () => {
      if (isYoutube) {
        playlist.shift();
        await onPlaylistChanged();
        if (playlist.length === 0) connection.destroy();
      } else connection.destroy();
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
