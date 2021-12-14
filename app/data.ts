import { LocalizedString } from './localization';

import _goals from '../data/goals.yml';
import _questions from '../data/questions.yml';

export type QuestionId = string;
export type GoalId = string;

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

export type Goal = {
  sections: Section[];
};

export type Section = {
  title: LocalizedString;
  body:  LocalizedString;
}

const questions: {[id: QuestionId]: Question} = _questions;
const goals: {[id: GoalId]: Goal} = _goals;

export const initialQuestion = questions.q1;

export function findQuestion(id: QuestionId) {
  const question = questions[id];

  if (!question) { throw new Error(`question not found: id=${id}`) }

  return question;
}

export function findGoal(id: GoalId) {
  const goal = goals[id];

  if (!goal) { throw new Error(`goal not found: id=${id}`) }

  return goal;
}
