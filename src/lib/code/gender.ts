import { getDocuments } from "$lib/firebase/getDocuments";

export async function getGenderList() {
	try {
    return await getDocuments([
      {
        name: "b_code_gender",
				order_by: { field: "order", direction: "asc" },
      },
    ])
	} catch (error) {
		console.error("性自認コードの読み込み中にエラーが出ました。", error);
	}
}
