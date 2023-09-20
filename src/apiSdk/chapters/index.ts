import axios from 'axios';
import queryString from 'query-string';
import { ChapterInterface, ChapterGetQueryInterface } from 'interfaces/chapter';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getChapters = async (query?: ChapterGetQueryInterface): Promise<PaginatedInterface<ChapterInterface>> => {
  const response = await axios.get('/api/chapters', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createChapter = async (chapter: ChapterInterface) => {
  const response = await axios.post('/api/chapters', chapter);
  return response.data;
};

export const updateChapterById = async (id: string, chapter: ChapterInterface) => {
  const response = await axios.put(`/api/chapters/${id}`, chapter);
  return response.data;
};

export const getChapterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/chapters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteChapterById = async (id: string) => {
  const response = await axios.delete(`/api/chapters/${id}`);
  return response.data;
};
