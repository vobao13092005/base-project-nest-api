import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DateTimeService {
  getDateInGMT7(date?: Date): Date {
    const inputDate = date ?? new Date();
    const utcDate = dayjs.utc(inputDate);
    return new Date(utcDate.add(7, 'hour').valueOf());
  }

  dateFormat(date: Date, format = 'yyyyMMddHHmmss'): number {
    const pad = (n: number) => (n < 10 ? `0${n}` : n).toString();
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return Number(
      format
        .replace('yyyy', year.toString())
        .replace('MM', month)
        .replace('dd', day)
        .replace('HH', hour)
        .replace('mm', minute)
        .replace('ss', second),
    );
  }

  parseDate(
    dateNumber: number | string,
    tz: 'utc' | 'local' | 'gmt7' = 'local',
  ): Date {
    const dateString = dateNumber.toString();

    const _parseInt = Number.parseInt;

    const year = _parseInt(dateString.slice(0, 4));
    const month = _parseInt(dateString.slice(4, 6)) - 1;
    const day = _parseInt(dateString.slice(6, 8));
    const hour = _parseInt(dateString.slice(8, 10));
    const minute = _parseInt(dateString.slice(10, 12));
    const second = _parseInt(dateString.slice(12, 14));

    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

    switch (tz) {
      case 'utc': {
        return dayjs.utc(formattedDate).toDate();
      }
      case 'gmt7': {
        const localDate = new Date(year, month, day, hour, minute, second);
        const utcTime = dayjs.utc(localDate);
        return utcTime.add(7, 'hour').toDate();
      }
      case 'local':
      default:
        return new Date(year, month, day, hour, minute, second);
    }
  }
}