import axios from 'axios';
import queryString from 'query-string';
import { StudySessionInterface, StudySessionGetQueryInterface } from 'interfaces/study-session';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getStudySessions = async (
  query?: StudySessionGetQueryInterface,
): Promise<PaginatedInterface<StudySessionInterface>> => {
  const response = await axios.get('/api/study-sessions', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createStudySession = async (studySession: StudySessionInterface) => {
  const response = await axios.post('/api/study-sessions', studySession);
  return response.data;
};

export const updateStudySessionById = async (id: string, studySession: StudySessionInterface) => {
  const response = await axios.put(`/api/study-sessions/${id}`, studySession);
  return response.data;
};

export const getStudySessionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/study-sessions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStudySessionById = async (id: string) => {
  const response = await axios.delete(`/api/study-sessions/${id}`);
  return response.data;
};
