import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { configureLocalization, msg, localized } from '@lit/localize';

import * as localeJa from './generated/locales/ja';
import { questions, results, Question, Choice, Result, LocalizedString } from './data';
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

  render() {
    return html`
      <div class="stack border">
        ${this.renderSteps()}
        ${this.renderResult()}
      </div>
    `;
  }

  renderSteps() {
    console.log(this.steps.length);

    return this.steps.map((step) => {
      const {question, choice} = step;

      if (choice) {
        return html`
          <div>
            <p class="box bg-light">${this.localize(question.text)}</p>

            <p class="box">
              ${this.localize(choice.label)}
              <small><a @click=${this.backTo(step)} href="#">${msg('Change')}</a></small>
            </p>
          </div>
        `;
      } else {
        return html`
          <div>
            <p class="box bg-light">${this.localize(question.text)}</p>

            <ul class="box cluster">
              ${question.choices.map((choice: Choice) => {
                return html`
                  <li>
                    <a @click=${this.choose(step, choice)} href="#" class="choice-button">${this.localize(choice.label)}</a>
                  </li>
                `;
              })}
            </ul>
          </div>
        `;
      }
    });
  }

  renderResult() {
    const next = this.lastStep?.choice?.next;

    if (!next || next.type !== 'result') { return ''; }

    const {repository} = results[next.id];

    return html`
      <div class="box border-top">
        <p>✅ ${msg('You can submit your data to the following database:')}</p>
        <a href=${repository.url}>${repository.name}</a> - ${repository.description}
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
        case 'result':
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
    return source[this.locale];
  }
}
