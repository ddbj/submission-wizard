import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';

import { LocalizationMixin } from '../localization';
import { Question, Choice, questions } from '../data';

import baseStyle from './base.css';
import style from './submission-wizard.css';

import './submission-wizard-goal';

type Step = {
  question: Question,
  choice?:  Choice
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
    const {question, choice} = step;

    const questionTemplate = html`
      <p class="box bg-primary my-0"><b>Q${seq}.</b> ${this.localize(question.text)}</p>
    `;

    if (choice) {
      return html`
        <div class="border border-rounded">
          ${questionTemplate}

          <p class="box my-0">
            ${this.localize(choice.label)}
            <small><a @click=${this.backTo(step)} href="#">${msg('Change')}</a></small>
          </p>
        </div>
      `;
    } else {
      return html`
        <div class="border border-rounded fade">
          ${questionTemplate}

          <ul class="divide list-unstyled my-0">
            ${question.choices.map((choice: Choice) => {
              return html`
                <li>
                  <a @click=${this.choose(step, choice)} href="#" class="box choice">${this.localize(choice.label)}</a>
                </li>
              `;
            })}
          </ul>
        </div>
      `;
    }
  }

  goalTemplate() {
    const next = this.lastStep?.choice?.next;

    if (!next || next.type !== 'goal') { return ''; }

    return html`
      <div>
        <submission-wizard-goal locale=${this.locale} goal=${next.id}></submission-wizard-goal>
      </div>
    `;
  }

  choose(step: Step, choice: Choice) {
    return (e: Event) => {
      e.preventDefault();

      step.choice = choice;

      switch (choice.next.type) {
        case 'question': {
          const question = questions[choice.next.id];

          this.steps.push({question});
          break;
        }
        case 'goal':
          // do nothing
          break;
        default: {
          const _: never = choice.next; // eslint-disable-line @typescript-eslint/no-unused-vars
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
