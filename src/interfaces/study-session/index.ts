import { UserInterface } from 'interfaces/user';
import { TextbookInterface } from 'interfaces/textbook';
import { GetQueryInterface } from 'interfaces';

export interface StudySessionInterface {
  id?: string;
  start_time: any;
  end_time: any;
  user_id: string;
  textbook_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  textbook?: TextbookInterface;
  _count?: {};
}

export interface StudySessionGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  textbook_id?: string;
}
