import { QuestionInterface } from 'interfaces/question';
import { TextbookInterface } from 'interfaces/textbook';
import { GetQueryInterface } from 'interfaces';

export interface ChapterInterface {
  id?: string;
  title: string;
  number: number;
  page_start: number;
  page_end: number;
  textbook_id: string;
  created_at?: any;
  updated_at?: any;
  question?: QuestionInterface[];
  textbook?: TextbookInterface;
  _count?: {
    question?: number;
  };
}

export interface ChapterGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  textbook_id?: string;
}
