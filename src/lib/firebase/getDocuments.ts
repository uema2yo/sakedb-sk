import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "$lib/firebase/init";
import type { WhereFilterOp, OrderByDirection, DocumentData } from "firebase/firestore";

interface Condition {
  name: string;
  operator: WhereFilterOp;
  value: string | number | boolean;
}

interface CollectionConfig {
  name: string;
  conditions: Condition[];
  public_only?: boolean;
  order_by: {
    field: string;
    direction: OrderByDirection;
  };
  limit_num: number;
}

export async function getDocuments(
  collections: CollectionConfig[]
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
  try {
    const promises = collections.map(async (config) => {
      const { name, conditions, public_only = true, order_by, limit_num } = config;
      const collectionRef = collection(db, name);
      let q = query(collectionRef, ...conditions.map((condition) => where(condition.name, condition.operator, condition.value)));
      if (public_only) {
        q = query(q, where("public", "==", true));
      }
      q = query(q, orderBy(order_by.field, order_by.direction));
      if (limit_num) {
        q = query(q, limit(limit_num));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs;
    });

    const results = await Promise.all(promises);
    const mergedDocs = results.flat();
    return mergedDocs;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
