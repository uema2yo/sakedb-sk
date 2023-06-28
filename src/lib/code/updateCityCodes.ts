import { env } from "$env/dynamic/public";
import { updateCodes } from "$lib/code/updateCodes";

const headers = {
	headers: {
		"X-API-KEY": env.PUBLIC_RESAS_API_KEY
	}
};

async function getCityApi(prefCode: number) {
	if (prefCode === 0) return;
	const cityApi = await fetch(
		"https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=" + prefCode,
		headers
	);
	return await cityApi.json();
}

export async function updateCityCodes() {
	try {
		const prefectureApi = await fetch(
			"https://opendata.resas-portal.go.jp/api/v1/prefectures",
			headers
		);
		const resPrefectureApi = await prefectureApi.json();
		const resPrefectureApiResults = resPrefectureApi.result;

		resPrefectureApiResults.forEach(async (prefecture: { prefCode: number; prefName: string }) => {
			const resCityApi = await getCityApi(prefecture.prefCode);
			const resCityApiResults = resCityApi.result;
			let cityCodes = [];
			resCityApiResults.forEach((r: { bigCityFlag: string; cityCode: number; cityName: string; prefCode: number; }) => {
				if (r.bigCityFlag !== "2") {
					cityCodes.push({
						code: r.cityCode,
						label: r.cityName,
						prefCode: r.prefCode,
						bigCityFlag: r.bigCityFlag
					});
				}
			});
			updateCodes("b_code_city", cityCodes);
			cityCodes = [];
		});

	} catch (error) {
		console.error("市区町村一覧データ API の読み込みに失敗しました。");
	}
}
