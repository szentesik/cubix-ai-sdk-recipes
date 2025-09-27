'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
  embeddings,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbedding } from '@/lib/ai/embedding';

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddingData = await generateEmbedding(content);

    await db.insert(embeddings).values(
      {
        resourceId: resource.id,
        content: content,
        embedding: embeddingData,
      },
    );

    return 'Resource successfully created.';
  } catch (e) {
    /*
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'Error, please try again.';
    */
    throw e
  }
};