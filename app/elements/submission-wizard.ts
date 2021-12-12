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
  steps: Step[] = [
    {question: questions.q1}
  ];

  get lastStep() {
    return this.steps[this.steps.length - 1];
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
        <div class="border border-round">
          ${questionEl}

          <p class="box my-0">
            ${this.localize(answer.label)}
            <small><a @click=${this.backTo(step)} href="#">${msg('Change')}</a></small>
          </p>
        </div>
      `;
    } else {
      return html`
        <div class="border border-round fade">
          ${questionEl}

          <ul class="divide list-unstyled my-0">
            ${question.options.map((option: Option) => {
              return html`
                <li>
                  <a @click=${this.choose(step, option)} href="#" class="box option">${this.localize(option.label)}</a>
                </li>
              `;
            })}
          </ul>
        </div>
      `;
    }
  }

  goalTemplate() {
    const next = this.lastStep?.answer?.next;

    if (!next || next.type !== 'goal') { return ''; }

    return html`
      <div>
        <submission-wizard-goal locale=${this.locale} goal=${next.id}></submission-wizard-goal>
      </div>
    `;
  }

  choose(step: Step, option: Option) {
    return (e: Event) => {
      e.preventDefault();

      step.answer = option;

      switch (option.next.type) {
        case 'question': {
          const question = questions[option.next.id];

          this.steps.push({question});
          break;
        }
        case 'goal':
          // do nothing
          break;
        default: {
          const _: never = option.next; // eslint-disable-line @typescript-eslint/no-unused-vars
        }
      }

      this.requestUpdate();
    }
  }

  backTo(step: Step) {
    return (e: Event) => {
      e.preventDefault();

      const i = this.steps.indexOf(step);

      this.steps.splice(i);
      this.steps.push({question: step.question});

      this.requestUpdate();
    }
  }
}
