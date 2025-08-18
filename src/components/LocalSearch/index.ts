import { wrap, Remote } from 'comlink';

interface Tag {
  en: string;
  cn: string;
  count: number;
  r18: number;
}

interface SearchWorkerAPI {
  loadTags(): Promise<void>;
  searchTags(query: string, filterR18?: boolean): Promise<Tag[]>;
}

let searchWorker: Remote<SearchWorkerAPI>;

export async function loadTags() {
  if (!searchWorker) {
    const worker = new Worker(new URL('../../workers/searchWorker.ts', import.meta.url), { type: 'module' });
    searchWorker = wrap<SearchWorkerAPI>(worker);
  }
  return searchWorker.loadTags();
}

export async function searchTags(query: string, filterR18: boolean = false): Promise<Tag[]> {
  if (!searchWorker) {
    console.warn('Search worker not initialized. Call loadTags() first.');
    return [];
  }

  let results: Tag[];

  results = await searchWorker.searchTags(query, filterR18);

  return results;
}
