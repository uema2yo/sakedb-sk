import { getDocuments } from "$lib/firebase/getDocuments";
 
export async function getCityOptions (prefCode){
  const options = [];
  const cities = await getDocuments([
    {
      collectionName: "b_code_city",
      conditions: [
        {
          name: "prefCode",
          operator: "==",
          value: prefCode
        }
      ],
      order_by: { field: "code", direction: "asc" }
    }
  ]);
  options.push({ value: 0, innerText: "----" });
  cities.map((city) => {
    options.push({ value: city.code, innerText: city.label });
  });
  return options;  
}

