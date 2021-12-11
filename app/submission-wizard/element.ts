import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';

import { LocalizationMixin } from '../localization';
import { Question, Choice, questions } from '../data';

import baseStyle from '../base.css';
import style from './style.css';

import '../submission-wizard-goal';

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
    return this.steps.map(this.stepTemplate.bind(this));
  }

  stepTemplate(step: Step) {
    const {question, choice} = step;

    if (choice) {
      return html`
        <div class="border border-rounded">
          <p class="box bg-primary my-0">${this.localize(question.text)}</p>

          <p class="box my-0">
            ${this.localize(choice.label)}
            <small><a @click=${this.backTo(step)} href="#">${msg('Change')}</a></small>
          </p>
        </div>
      `;
    } else {
      return html`
        <div class="border border-rounded">
          <p class="box bg-primary my-0">${this.localize(question.text)}</p>

          <div class="box">
            <ul class="stack-small list-unstyled">
              ${question.choices.map((choice: Choice) => {
                return html`
                  <li>
                    <a @click=${this.choose(step, choice)} href="#">${this.localize(choice.label)}</a>
                  </li>
                `;
              })}
            </ul>
          </div>
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
