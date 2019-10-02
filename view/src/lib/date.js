import { DateTime, Duration } from 'luxon';

// FIXME: use i18n
export default function (millis, prefix) {
  const date = DateTime.fromMillis(millis);
  const now = DateTime.local();
  const duration = Duration
    .fromMillis(now.toMillis() - date.toMillis())
    .shiftTo('years', 'months', 'days', 'hours', 'minutes')
    .toObject();
  const formattedDurations = Object.keys(duration)
    .reduce((result, key) => {
      if (duration[key] > 0 && result.length < 2) {
        result.push(`${Math.round(duration[key])} ${key}`);
      }
      return result;
    }, []);

  let result;
  if (date.year !== now.year) {
    result = date.toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' });
    if (prefix) result = `${prefix} on ${result}`;
  } else if (date.year === now.year && duration.months > 2) {
    result = date.toLocaleString({ month: 'long', day: 'numeric' });
    if (prefix) result = `${prefix} on ${result}`;
  } else {
    result = formattedDurations.join(' ');
    // .replace('years', '年')
    // .replace('months', '月')
    // .replace('days', '天')
    // .replace('hours', '小时')
    // .replace('minutes', '分钟');
    if (prefix) result = `${prefix} ${result}`;
  }

  return result;
}
