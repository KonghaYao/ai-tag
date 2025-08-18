import MiniSearch from 'minisearch';
import Papa from 'papaparse';
import { expose } from 'comlink';

interface Tag {
  id: number;
  en: string;
  cn: string;
  count: number;
  r18: number;
}

let miniSearch: MiniSearch<Tag>;
let allTags: Tag[] = [];

export async function loadTags() {
  if (miniSearch) return;

  const response = await fetch('/tags.csv');
  const csvText = await response.text();

  return new Promise<void>((resolve, reject) => {
    Papa.parse<Tag>(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        allTags = results.data.filter((tag: Tag) => tag.en || tag.cn).map((tag: Tag, index) => ({ ...tag, id: index })); // Filter out empty rows and add id
        miniSearch = new MiniSearch({
          fields: ['en', 'cn'],
          storeFields: ['en', 'cn', 'count', 'r18', 'id'],
          idField: 'id',
          searchOptions: {
            prefix: true,
            fuzzy: 0.2
          }
        });
        miniSearch.addAll(allTags);
        resolve();
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export function searchTags(query: string, filterR18: boolean = false) {
  if (!miniSearch) {
    console.warn('MiniSearch not initialized. Call loadTags() first.');
    return [];
  }
  if(!query) return allTags.slice(0,100)
  let results = miniSearch.search(query) as unknown as (Tag & { score: number })[];

  if (filterR18) {
    results = results.filter(tag => tag.r18 === 0);
  }

  // Sort by count in descending order, then by score
  results.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return b.score - a.score;
  });

  return results;
}

const api = {
  loadTags,
  searchTags
};

expose(api);
