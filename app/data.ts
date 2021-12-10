export type QuestionId = string;
export type GoalId = string;

export type Question = {
  type: 'question';
  text: LocalizedString;
  choices: Choice[];
}

export type Choice = {
  label: LocalizedString;

  next: {
    type: 'question';
    id: QuestionId;
  } | {
    type: 'goal';
    id: GoalId;
  };
};

export type Goal = {
  type: 'goal';

  sections: {
    title: LocalizedString;
  }[];
};

export type LocalizedString = {
  en: string,
  ja?: string
};

import _questions from '../data/questions.yml';

export const questions: {[id: QuestionId]: Question} = _questions;

import _goals from '../data/goals.yml';

export const goals: {[id: GoalId]: Goal} = _goals;
