/**
 * 获取时间段数组显示文本
 * @param timeSlots 时间段数组，如[9:00-10:00, 10:00-11:00]
 */
export function getTimeSlots(timeSlotsArr?: string[]) {
  if (!timeSlotsArr?.length) return '';
  if (timeSlotsArr.length === 1) return timeSlotsArr[0];
  return `${timeSlotsArr[0].split('-')[0]}-${timeSlotsArr[timeSlotsArr.length - 1].split('-')[1]}`;
}

/**
 * 获取全时间段数组
 * @param timeSlots 时间段 如9:00-12:00
 * @returns 时间段数组 如[9:00-10:00, 10:00-11:00, 11:00-12:00]
 */
export function getTimeSlotsArr(timeSlots: string) {
  if (!timeSlots) return [];
  const timeArr = timeSlots.split('-');
  const begin = +timeArr[0].split(':')[0];
  const end = +timeArr[1].split(':')[0];
  if (begin >= end) return [];
  return new Array(end - begin).fill(0).map((_, i) => `${i + begin}:00-${i + begin + 1}:00`);
}

/**
 * 获取时间段时间间隔
 * @param timeSlots 时间段 如9:00
 */
export function getTimeSlotsInterval(timeSlots: string) {
  const timeSlotsArr = timeSlots.split('-');
  return +timeSlotsArr[1].split(':')[0] - +timeSlotsArr[0].split(':')[0];
}

export function isConfictiTimeSlots(timeSlot1: string, timeSlot2: string) {
  const timeSlot1Arr = timeSlot1.split('-');
  const timeSlot2Arr = timeSlot2.split('-');
  const s1 = +timeSlot1Arr[0].split(':')[0];
  const e1 = +timeSlot1Arr[1].split(':')[0];
  const s2 = +timeSlot2Arr[0].split(':')[0];
  const e2 = +timeSlot2Arr[1].split(':')[0];
  return !((s2 < s1 && e2 <= s1) || (s2 > s1 && s2 >= e1));
}
