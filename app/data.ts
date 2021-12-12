import { LocalizedString } from './localization';

import _goals from '../data/goals.yml';
import _questions from '../data/questions.yml';

export const questions: {[id: QuestionId]: Question} = _questions;
export const goals: {[id: GoalId]: Goal} = _goals;

export type QuestionId = string;
export type GoalId = string;

export type Question = {
  type:    'question';
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

export type Goal = {
  sections: Section[];
};

export type Section = {
  title: LocalizedString;
  body:  LocalizedString;
}
