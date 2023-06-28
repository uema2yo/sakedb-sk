import { env } from "$env/dynamic/public";
//import { addDocuments } from "$lib/firebase/addDocuments";
import { updateCodes } from "$lib/code/updateCodes";

export async function updateRegionCodes() {
	try {
		const region = await fetch("https://opendata.resas-portal.go.jp/api/v1/regions/broad", {
			headers: {
				"X-API-KEY": env.PUBLIC_RESAS_API_KEY
			}
		});

		const regionCodes = [];

		const res = await region.json();

		res.result.forEach((r: { regionCode: number; regionName: string; }) => {
			regionCodes.push({ code: r.regionCode, label: r.regionName });
		});

		//addDocuments("b_code_region", regionCodes);
		updateCodes("b_code_region", regionCodes);
	} catch (error) {
		console.error("地域一覧データ API の読み込みに失敗しました。");
	}
}
