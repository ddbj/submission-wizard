import microBase from 'micro-base';

import { Option, Question, findQuestion, initialQuestion } from './data/question';

export async function findState(targetHash: string, question: Question = initialQuestion, path: Option[] = []): Promise<Option[] | null> {
  for (const option of question.options) {
    const newPath = [...path, option];
    const hash    = await calculateHash(newPath.map(({id}) => id));

    if (hash === targetHash) { return newPath; }

    const {type, id} = option.next;

    if (type === 'question') {
      const maybePath = await findState(targetHash, findQuestion(id), newPath);

      if (maybePath) { return maybePath; }
    }
  }

  return null;
}

export async function calculateHash<T>(obj: T): Promise<string> {
  const json   = JSON.stringify(obj);
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(json));

  return microBase.base58.encode(new Uint8Array(digest));
}
