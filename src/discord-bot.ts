import {
  Client,
  GatewayIntentBits,
  Partials,
  VoiceChannel,
  Message,
  Events,
  ChannelType,
} from "discord.js";
import { config } from "./Configs/config";
import { helpMessage } from "./Constants/helpMessage";
import { commandHandler } from "./Handlers/commandHandler";
import { InteractionHandler } from "./Handlers/interactionHandler";

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

const prefix = config.PREFIX;

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

  await commandHandler(command, message);
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
  await InteractionHandler(interaction, voiceChannel);
});

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(config.API_KEY).catch((error) => console.error(error));
