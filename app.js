import dotenv from 'dotenv';
import RuuviTag from './src/ruuvitag'
dotenv.config();
RuuviTag.start();
