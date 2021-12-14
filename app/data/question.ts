import { LocalizedString } from '../localization';

import _questions from '../../data/questions.yml';
import { Id as GoalId } from './goal';

export type Id = string;

export type Question = {
  text:    LocalizedString;
  options: Option[];
}

export type Option = {
  label: LocalizedString;

  next: {
    type: 'question';
    id:   Id;
  } | {
    type: 'goal';
    id:   GoalId;
  };
};

const questions: {[id: Id]: Question} = _questions;

export const initialQuestion = questions.q1;

export function findQuestion(id: Id) {
  const question = questions[id];

  if (!question) { throw new Error(`question not found: id=${id}`) }

  return question;
}
