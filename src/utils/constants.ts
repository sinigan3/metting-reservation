import { getTimeSlotsArr } from './help';
import dayjs from 'dayjs';

export const TOTAL_TIME = 12;

export const ALL_TIME_SLOTS = getTimeSlotsArr('9:00-21:00');

export const USAGE_CODES = new Array(4).fill(0).map((_, i) => i);
export enum USAGE_CODE_ENUM {
  '项目例会',
  '讨论会',
  '分享会',
  '需求澄清会'
}

export const DATE_FORMAT = 'YYYY-MM-DD';

export const TODAY_DATE = dayjs().format(DATE_FORMAT);
