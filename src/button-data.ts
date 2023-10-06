import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export enum ButtonId {
  waifm = "Wai FM",
  traxxfm = "Traxx FM",
  hitzfm = "Hitz FM",
  tutup = "Tutup Radio",
}

const buttonData = [
  {
    customId: ButtonId.waifm,
    label: ButtonId.waifm,
    style: ButtonStyle.Primary,
  },
  {
    customId: ButtonId.traxxfm,
    label: ButtonId.traxxfm,
    style: ButtonStyle.Primary,
  },
  {
    customId: ButtonId.hitzfm,
    label: ButtonId.hitzfm,
    style: ButtonStyle.Primary,
  },
  {
    customId: ButtonId.tutup,
    label: ButtonId.tutup,
    style: ButtonStyle.Danger,
  },
  // Add more button data as needed
];

export const buttonRows = () => {
  const rows = [];
  for (const data of buttonData) {
    const button = new ButtonBuilder()
      .setCustomId(data.customId)
      .setLabel(data.label)
      .setStyle(data.style);

    rows.push(button);
  }
  return rows;  
};
