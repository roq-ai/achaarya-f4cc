const mapping: Record<string, string> = {
  chapters: 'chapter',
  providers: 'provider',
  questions: 'question',
  'study-sessions': 'study_session',
  textbooks: 'textbook',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
