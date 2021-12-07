export type QuestionId = string;
export type ResultId = string;

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
    type: 'result';
    id: ResultId;
  };
};

export type Result = {
  type: 'result';

  repository: {
    url: string;
    name: string;
    description: string;
  };
};

export type LocalizedString = {
  en: string,
  ja: string
};

import _questions from '../data/questions.yml';

export const questions: {[id: QuestionId]: Question} = _questions;

import _results from '../data/results.yml';

export const results: {[id: ResultId]: Result} = _results;
