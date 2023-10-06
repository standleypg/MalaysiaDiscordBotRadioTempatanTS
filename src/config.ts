import fs from 'fs';
import path from 'path';

const configPath = path.join(__dirname, './../config.json');

// Load the configuration JSON file
const rawConfig = fs.readFileSync(configPath, 'utf8');
export const config = JSON.parse(rawConfig);


