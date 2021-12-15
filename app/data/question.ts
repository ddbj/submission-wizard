import { LocalizedString } from '../localization';

import _questions from '../../data/questions.yml';
import { GoalId } from './goal';

type QuestionId = string;

export type Question = {
  text:    LocalizedString;
  options: Option[];
}

export type Option = {
  label: LocalizedString;

  next: {
    type: 'question';
    id:   QuestionId;
  } | {
    type: 'goal';
    id:   GoalId;
  };
};

const questions: {[id: QuestionId]: Question} = _questions;

export const initialQuestion = questions.q1;

export function findQuestion(id: QuestionId) {
  const question = questions[id];

  if (!question) { throw new Error(`question not found: id=${id}`) }

  return question;
}
