import { ChapterInterface } from 'interfaces/chapter';
import { GetQueryInterface } from 'interfaces';

export interface QuestionInterface {
  id?: string;
  content: string;
  chapter_id: string;
  difficulty_level: number;
  question_type: string;
  answer: string;
  created_at?: any;
  updated_at?: any;

  chapter?: ChapterInterface;
  _count?: {};
}

export interface QuestionGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  chapter_id?: string;
  question_type?: string;
  answer?: string;
}
