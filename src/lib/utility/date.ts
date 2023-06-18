export let selectedYear: number | null = null;
export let selectedMonth: number | null = null;
export let selectedDay: number | null = null;

export function generateDate(
	start: { year: number; month: number; date: number },
	end: { year: number; month: number; date: number } | "today"
) {
	let days = [];
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	// 選択可能な年を生成
	function generateYears() {
		const endYear = end === "today" ? currentYear : end.year;
		const years: {value: number; innerText: string}[] = [{value: 0, innerText: "---- 年"}];
		for (let year = start.year; year <= endYear; year++) {
			years.push({value: year, innerText: `${year} 年`});
		}
		return years;
	}

	// 選択可能な月を生成
	function generateMonths() {
		const startMonth = selectedYear === start.year ? start.month : 1;
		const endMonth = (() => {
			if (end === "today") {
				return selectedYear === currentYear ? currentMonth : 12;
			} else if (selectedYear === end.year) {
				return end.month;
			} else {
				return 12;
			}
		})();
		const months: {value: number; innerText: string}[] = [{value: 0, innerText: "-- 月"}];
		if (selectedYear) {
			for (let month = startMonth; month <= endMonth; month++) {
				months.push({value:month, innerText: `${month} 月`});
			}
		}
		return months;
	}

	// 選択可能な日を生成
	function generateDays() {
		const year = selectedYear;
		const month = selectedMonth;
		const daysInMonth = year && month && new Date(year, month, 0).getDate();
		const days: {value: number; innerText: string}[] = [{value: 0, innerText: "-- 日"}];
    if(daysInMonth) {
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({value:day, innerText:`${day} 日`});
      }
    }
		return days;
	}

	// 年、月、日の変更時に日付を生成
	function updateDates() {
		days = generateDays();
		selectedDay = null;
	}

	return {
		generateYears: generateYears,
		generateMonths: generateMonths,
		generateDays: generateDays,
		updateDates: updateDates
	};
}
