import axios from 'axios';
import queryString from 'query-string';
import { TextbookInterface, TextbookGetQueryInterface } from 'interfaces/textbook';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getTextbooks = async (
  query?: TextbookGetQueryInterface,
): Promise<PaginatedInterface<TextbookInterface>> => {
  const response = await axios.get('/api/textbooks', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createTextbook = async (textbook: TextbookInterface) => {
  const response = await axios.post('/api/textbooks', textbook);
  return response.data;
};

export const updateTextbookById = async (id: string, textbook: TextbookInterface) => {
  const response = await axios.put(`/api/textbooks/${id}`, textbook);
  return response.data;
};

export const getTextbookById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/textbooks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTextbookById = async (id: string) => {
  const response = await axios.delete(`/api/textbooks/${id}`);
  return response.data;
};
