import data from '../data.yml';

export type Node = Question | Result;

export type Question = {
  type: 'question';
  text: LocalizedString;
  choices: Choice[];
}

export type Choice = {
  label: LocalizedString;
  next: string;
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

export default data as {[id: string]: Node};
