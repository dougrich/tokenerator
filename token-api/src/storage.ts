import { Model } from "@dougrich/tokenerator";
import * as Datastore from "@google-cloud/datastore";

import { decrypt, encrypt } from "./encrypt";

const pageSize = 25;

const datastore = Datastore({
  projectId: process.env.project,
});

export interface Document {
  id: string;
  created: string;
  revision: number;
}

export interface Page<T extends Document> {
  cursor: string;
  moreResults: boolean;
  documents: T[];
}

export class Collection<T extends Document> {
  constructor(
    public collectionName: string,
  ) { }

  async create(data: T) {

    const document = {
      data,
      key: datastore.key([this.collectionName, data.id]),
    };

    await datastore.save(document);
  }

  async get(id: string) {

    const key = datastore.key([this.collectionName, id]);

    const [document] = await datastore.get(key);

    return document as T;
  }

  async query(cursor?: string): Promise<Page<T>> {
    const query = datastore.createQuery(this.collectionName)
      .limit(pageSize);

    if (!!cursor) {
      query.start(decrypt(cursor));
    }

    const [entities, info] = await datastore.runQuery(query);

    return {
      cursor: encrypt(info.endCursor),
      documents: entities,
      moreResults: info.moreResults !== Datastore.NO_MORE_RESULTS,
    };
  }
}

export const token = new Collection("token");
