import {
  ButtonInteraction,
  CacheType,
  Message,
  VoiceChannel,
} from "discord.js";
import { InitiateVoiceChannel } from "./Handlers/initiator";

interface Song {
  url: string;
  interaction: ButtonInteraction<CacheType> | Message;
  voiceChannel: VoiceChannel;
  isYoutube: boolean;
}
export const playlist: Song[] = [];

let previousPlaylistLength = playlist.length;

export async function onPlaylistChanged(
  message: Message | undefined = undefined
) {
  const currentPlaylistLength = playlist.length;

  if (
    currentPlaylistLength < previousPlaylistLength ||
    currentPlaylistLength === 1
  ) {
    const currentSong = playlist[0];
    if (playlist.length !== 0) {
      if ((currentSong.interaction as any) instanceof Message) {
        InitiateVoiceChannel<Message>(
          currentSong.url,
          currentSong.interaction as Message,
          currentSong.voiceChannel,
          currentSong.isYoutube
        );
      } else {
        InitiateVoiceChannel<ButtonInteraction<CacheType>>(
          currentSong.url,
          currentSong.interaction as ButtonInteraction<CacheType>,
          currentSong.voiceChannel,
          currentSong.isYoutube
        );
      }
    } else {
      message?.reply("This is your last song. Cannot skip");
    }
  }

  previousPlaylistLength = currentPlaylistLength;
}
