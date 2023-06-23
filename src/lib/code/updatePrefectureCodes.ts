import { env } from "$env/dynamic/public";
import { setDocuments } from "$lib/firebase/setDocuments";

export async function updatePrefectureCodes() {
	try {
		const prefecture = await fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
			headers: {
				"X-API-KEY": env.PUBLIC_RESAS_API_KEY
			}
		});

		const prefectureCodes = [];

		const res = await prefecture.json();

		res.result.forEach((r) => {
			prefectureCodes.push({ code: r.prefCode, label: r.prefName });
		});

		setDocuments("b_code_prefecture", prefectureCodes);
	} catch (error) {
		console.error("都道府県一覧データ API の読み込みに失敗しました。");
	}
}
