import { LocalizedString } from '../localization';

import _goals from '../../data/goals.yml';

export type GoalId = string;

export type Goal = {
  sections: Section[];
};

export type Section = {
  title: LocalizedString;
  body:  LocalizedString;
}

const goals: {[id: GoalId]: Goal} = _goals;

export function findGoal(id: GoalId) {
  const goal = goals[id];

  if (!goal) { throw new Error(`goal not found: id=${id}`) }

  return goal;
}

