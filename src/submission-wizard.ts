import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { configureLocalization, msg, localized } from '@lit/localize';

import * as localeJa from './generated/locales/ja';
import { questions, goals, Question, Choice, Goal, LocalizedString } from './data';
import style from './style';
import { sourceLocale, targetLocales } from './generated/locales';

type Step = {
  question: Question,
  choice?:  Choice
};

const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,

  async loadLocale(locale) {
    switch (locale) {
      case 'ja':
        return localeJa;
      default:
        throw new Error('must not happen');
    }
  }
});

type Locale = 'en' | 'ja';

@localized()
@customElement('submission-wizard')
export class SubmissionWizard extends LitElement {
  static styles = style;

  set locale(newVal: Locale) {
    const oldVal = getLocale();

    setLocale(newVal).then(() => {
      this.requestUpdate('locale', oldVal);
    });
  }

  @property()
  get locale() {
    return getLocale() as Locale;
  }

  @state()
  steps: Step[] = [
    {question: questions.q1}
  ];

  get lastStep() {
    return this.steps[this.steps.length - 1];
  }

  get goal() {
    const next = this.lastStep?.choice?.next;

    if (!next || next.type !== 'goal') { return undefined; }

    return goals[next.id];
  }

  render() {
    return html`
      <div class="stack-large">
        ${this.stepsTemplate(this.steps)}
        ${this.goalTemplate(this.goal)}
      </div>
    `;
  }

  stepsTemplate(steps: Step[]) {
    return steps.map(this.stepTemplate.bind(this));
  }

  stepTemplate(step: Step) {
    const {question, choice} = step;

    if (choice) {
      return html`
        <div class="border rounded">
          <p class="box question-text my-0">${this.localize(question.text)}</p>

          <p class="box my-0">
            ${this.localize(choice.label)}
            <small><a @click=${this.backTo(step)} href="#">${msg('Change')}</a></small>
          </p>
        </div>
      `;
    } else {
      return html`
        <div class="border rounded">
          <p class="box question-text my-0">${this.localize(question.text)}</p>

          <ul class="stack-small box list-unstyled">
            ${question.choices.map((choice: Choice) => {
              return html`
                <li>
                  <a @click=${this.choose(step, choice)} href="#">${this.localize(choice.label)}</a>
                </li>
              `;
            })}
          </ul>
        </div>
      `;
    }
  }

  goalTemplate(goal?: Goal) {
    if (!goal) { return ''; }

    const {sections} = goal;

    return html`
      <div class="box border rounded">
        <ul>
          ${sections.map(({name}) => {
            return html`
              <li>${this.localize(name)}</li>
            `;
          })}
        </ul>
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

  localize(source: LocalizedString): string {
    return source[this.locale] || source.en;
  }
}
