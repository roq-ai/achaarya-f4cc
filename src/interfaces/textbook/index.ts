import { ChapterInterface } from 'interfaces/chapter';
import { StudySessionInterface } from 'interfaces/study-session';
import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface TextbookInterface {
  id?: string;
  title: string;
  subject: string;
  grade_level: number;
  publication_year: any;
  publisher: string;
  provider_id: string;
  created_at?: any;
  updated_at?: any;
  chapter?: ChapterInterface[];
  study_session?: StudySessionInterface[];
  provider?: ProviderInterface;
  _count?: {
    chapter?: number;
    study_session?: number;
  };
}

export interface TextbookGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  subject?: string;
  publisher?: string;
  provider_id?: string;
}
