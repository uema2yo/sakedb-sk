export function getDateOffset(unit: string, offset: number) {
	const today: Date = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate();

	const offsetLogic: { years: Date; months: Date; days: Date } = {
		years: new Date(currentYear - offset, currentMonth, currentDay),
		months: new Date(currentYear, currentMonth - offset, currentDay),
		days: new Date(currentYear, currentMonth, currentDay - offset)
	};

  return offsetLogic[unit];
}

export function getFormatedDate(timestamp: number, style = "hyphen") {
  const date = new Date(timestamp);
  const yyyy: string = date.getFullYear().toString();
  const mm: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd: string = date.getDate().toString().padStart(2, "0");

  const styleSet = {
    ja: `${yyyy} 年 ${mm} 月 ${dd} 日`,
    hyphen: `${yyyy}-${mm}-${dd}`
  }

	return styleSet[style];
}
