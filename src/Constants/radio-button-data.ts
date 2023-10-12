import { ButtonBuilder, ButtonStyle } from "discord.js";
import { config } from "../Configs/config";


export const Radios = [
  { id: "Wai FM", url: config.WAI_FM_URL },
  { id: "Traxx FM", url: config.TRAXX_FM_URL },
  { id: "Hitz FM", url: config.HITZ_FM_URL },
];

export const RadiosButtonRows = () => {
  const rows = [];
  for (const data of Radios) {
    const button = new ButtonBuilder()
      .setCustomId(data.id)
      .setLabel(data.id)
      .setStyle(ButtonStyle.Primary);

    rows.push(button);
  }
  return rows;
};
