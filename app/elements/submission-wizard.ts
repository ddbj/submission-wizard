import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';

import { LocalizationMixin } from '../localization';
import { Question, Option, findQuestion, initialQuestion } from '../data/question';

import baseStyle from './base.css';
import style from './submission-wizard.css';

import('./submission-wizard-goal');

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
  get questions(): Question[] {
    return [
      initialQuestion,
      ...this.answers.flatMap(({next: {type, id}}) => type === 'question' ? [findQuestion(id)] : [])
    ]
  }

  @state()
  get steps(): Step[] {
    return this.questions.map((question, i) => {
      return {
        question,
        answer: this.answers[i]
      }
    });
  }

  render() {
    return html`
      <div class="stack-large">
        ${this.steps.map((step, i) => {
          return this.stepTemplate(step, i + 1);
        })}

        ${this.goalTemplate()}
      </div>
    `;
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
