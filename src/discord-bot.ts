import {
  Client,
  GatewayIntentBits,
  Partials,
  VoiceChannel,
  Message,
  ActionRowBuilder,
  Events,
  ChannelType,
  Interaction,
  CacheType,
  ButtonInteraction,
} from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import { ButtonId, buttonRows } from "./button-data";
import { config } from "./config";
import ytdl from "ytdl-core";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

const prefix = config.PREFIX; // Change this to your desired command prefix

const helpMessage =
  "Hello kaban! Enti ka ngena bot tu, titih ka aja command ba baruh nya:\n" +
  "1. `/pasang-radio` - Belabuh masang radio ba voice channel alai nuan.\n" +
  "2. `/tukar-radio` - Milih radio baru deka dipasang ba voice channel alai nuan.\n" +
  "3. `/pasang-url` - Masang youtube url ba voice channel alai nuan.\n" +
  "4. `/tutup-radio` - Badu masang radio sereta bot deka ninggal ka voice channel alai nuan.";

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on(Events.MessageCreate, async (message: Message): Promise<any> => {
  if (message.content.includes("help")) {
    if (message.channel.type === ChannelType.DM) {
      // Respond with instructions
      await message.reply(helpMessage);
      return;
    }
  }

  const command = message.content.slice(prefix.length).trim();

  if (command === "help-radio") {
    await message.reply(helpMessage);
  }

  if (command === "pasang-radio" || command === "tukar-radio") {
    const row: any = new ActionRowBuilder().addComponents(buttonRows());

    // Send the message with the action row
    await message.reply({
      content: "Pilih radio kedeka ati nuan:",
      components: [row],
    });
  }

  if (command === "tutup-radio") {
    await message.reply(
      await DestroyVoiceChannel(message.member?.voice.channel as VoiceChannel)
    );
  }
  if (command.startsWith("pasang-url")) {
    const url = message.content.split(" ")[1];
    console.log(url);
    await InitiateVoiceChannel<Message>(
      url,
      message,
      message.member?.voice.channel as VoiceChannel
    );
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  const voiceChannel = interaction.guild?.voiceStates.cache.get(
    interaction.user.id
  )?.channel as VoiceChannel;

  if (
    interaction.message.content.startsWith(prefix) &&
    !interaction.message.author.bot
  ) {
    if (!voiceChannel) {
      await interaction.reply(
        "Nuan mesti ba dalam voice channel enti ka masang ngena command tu."
      );
    }
  }
  const { customId } = interaction;
  // Handle button interactions based on customId
  if (customId === ButtonId.waifm) {
    await interaction.reply("Masang Wai FM");
    InitiateVoiceChannel<ButtonInteraction<CacheType>>(
      config.WAI_FM_URL,
      interaction,
      voiceChannel
    );
  }
  if (customId === ButtonId.traxxfm) {
    await interaction.reply("Masang Traxx FM");
    InitiateVoiceChannel<ButtonInteraction<CacheType>>(
      config.TRAXX_FM_URL,
      interaction,
      voiceChannel
    );
  }

  if (customId === ButtonId.hitzfm) {
    await interaction.reply("Masang Hitz FM");
    InitiateVoiceChannel<ButtonInteraction<CacheType>>(
      config.HITZ_FM_URL,
      interaction,
      voiceChannel
    );
  }

  if (customId === ButtonId.tutup) {
    await interaction.reply(await DestroyVoiceChannel(voiceChannel));
  }
});

async function InitiateVoiceChannel<
  T extends ButtonInteraction<CacheType> | Message
>(url: string, arg: T, voiceChannel: VoiceChannel) {
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
    if (isMessage) {
      stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
    }

    const audioResource = createAudioResource(isMessage ? stream : url, {
      inlineVolume: true,
    });

    const audioPlayer = createAudioPlayer(
      isMessage
        ? {
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause,
            },
          }
        : undefined
    );

    audioPlayer.play(audioResource);

    connection.subscribe(audioPlayer);
    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
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

async function DestroyVoiceChannel(
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

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(config.API_KEY).catch((error) => console.error(error));
