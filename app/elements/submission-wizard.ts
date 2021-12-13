import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';

import { LocalizationMixin } from '../localization';
import { Question, Option, questions } from '../data';

import baseStyle from './base.css';
import style from './submission-wizard.css';

import './submission-wizard-goal';

type Step = {
  question: Question,
  answer?:  Option
};

@localized()
@customElement('submission-wizard')
export class SubmissionWizard extends LocalizationMixin(LitElement) {
  static styles = [baseStyle, style];

  @state()
  answers: Option[] = [];

  @state()
  get steps(): Step[] {
    const init = {
      question: questions.q1
    };

    return this.answers.reduce((steps, option) => {
      const lastStep = last(steps);

      if (!lastStep) { throw new Error('must not happen'); }

      const {type, id}   = option.next;
      const nextQuestion = type === 'question' && questions[id];

      return [
        ...steps.slice(0, -1),

        {
          ...lastStep,
          answer: option
        }
      ].concat(nextQuestion ? [
        {
          question: nextQuestion
        }
      ] : []);
    }, [init]);
  }

  render() {
    return html`
      <div class="stack-large">
        ${this.stepsTemplate()}
        ${this.goalTemplate()}
      </div>
    `;
  }

  stepsTemplate() {
    return this.steps.map((step, i) => this.stepTemplate(step, i + 1));
  }

  stepTemplate(step: Step, seq: number) {
    const {question, answer} = step;

    const questionEl = html`
      <p class="box bg-primary my-0"><b>Q${seq}.</b> ${this.localize(question.text)}</p>
    `;

    if (answer) {
      return html`
        <div class="border">
          ${questionEl}

          <p class="box my-0">
            ${this.localize(answer.label)}
            <small><a @click=${this.revert(answer)} href="#">${msg('Change')}</a></small>
          </p>
        </div>
      `;
    } else {
      return html`
        <div class="border fade">
          ${questionEl}

          <ul class="divide list-unstyled my-0">
            ${question.options.map((option: Option) => {
              return html`
                <li>
                  <a @click=${this.choose(option)} href="#" class="box option">${this.localize(option.label)}</a>
                </li>
              `;
            })}
          </ul>
        </div>
      `;
    }
  }

  goalTemplate() {
    const next = last(this.answers)?.next;

    if (!next || next.type !== 'goal') { return ''; }

    return html`
      <div>
        <submission-wizard-goal locale=${this.locale} goal=${next.id}></submission-wizard-goal>
      </div>
    `;
  }

  choose(option: Option) {
    return (e: Event) => {
      e.preventDefault();

      this.answers = [
        ...this.answers,
        option
      ];
    }
  }

  revert(option: Option) {
    return (e: Event) => {
      e.preventDefault();

      const i = this.answers.indexOf(option);

      this.answers = this.answers.slice(0, i);
    }
  }
}

function last<T>(ary: T[]): T | undefined {
  return ary[ary.length - 1];
}
