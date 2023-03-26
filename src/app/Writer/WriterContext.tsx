import { createContext } from 'solid-js';
import type { useTagsArticle } from './App';

export const WriterContext = createContext<ReturnType<typeof useTagsArticle>>();
