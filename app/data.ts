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
  choices: Choice[];
}

export type Choice = {
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
  type: 'goal';

  overview: LocalizedString;

  sections: {
    title: LocalizedString;
    body:  LocalizedString;
  }[];
};
