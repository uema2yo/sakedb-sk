import { getDocuments } from "$lib/firebase/getDocuments";

export async function getCountryOptions(regionCode: number) {
	const options = [];
	const countries = await getDocuments([
		{
			collectionName: "b_code_country",
			conditions: [
				{
					name: "regionCode",
					operator: "==",
					value: regionCode
				}
			],
			order_by: { field: "code", direction: "asc" }
		}
	]);
	countries.map((country, i) => {
    if( regionCode===1) {
      country.code === 192 && options.push({ value: 0, innerText: "----", regionCode: 0 });
    } else if(i === 0) {
      options.push({ value: 0, innerText: "----", regionCode: 0 });
    }
    options.push({ value: country.code, innerText: country.label, regionCode: country.regionCode });
	});
	return options;
}
