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

  @state()
  peekingChoice?: Choice;

  @state()
  previewTimeout?: ReturnType<typeof setTimeout>;

  get lastStep() {
    return this.steps[this.steps.length - 1];
  }

  get goal() {
    const lastChoice = this.lastStep?.choice;

    if (lastChoice?.next.type !== 'goal') { return undefined; }

    return nextNode(lastChoice) as Goal;
  }

  render() {
    return html`
      <div class="stack">
        ${this.stepsTemplate(this.steps)}
        ${this.choicePreviewTemplate(this.peekingChoice)}
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
        <div class="border">
          <p class="question-text">${this.localize(question.text)}</p>

          <p class="box">
            ${this.localize(choice.label)}
            <small><a @click=${this.backTo(step)} href="#">${msg('Change')}</a></small>
          </p>
        </div>
      `;
    } else {
      return html`
        <div class="border">
          <p class="question-text">${this.localize(question.text)}</p>

          <ul class="box cluster">
            ${question.choices.map((choice: Choice) => {
              return html`
                <li>
                  <a href="#" class="choice-button"
                    @click=${this.choose(step, choice)}
                    @mouseenter=${() => {
                      this.previewTimeout = setTimeout(() => this.peekingChoice = choice, 200);
                    }}
                    @mouseleave=${() => {
                      this.peekingChoice = undefined;

                      if (this.previewTimeout) {
                        clearTimeout(this.previewTimeout);
                      }
                    }}
                  >${this.localize(choice.label)}</a>
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

    const {destinations} = goal;

    return html`
      <div class="box border">
        <ul>
          ${destinations.map(({name}) => {
            return html`
              <li>${this.localize(name)}</li>
            `;
          })}
        </ul>
      </div>
    `;
  }

  choicePreviewTemplate(choice?: Choice) {
    if (!choice) { return ''; }

    const {next} = choice;

    switch (next.type) {
      case 'question': {
        const question = nextNode(choice) as Question;

        return html`<div class="preview">${this.stepTemplate({question})}</div>`;
      }
      case 'goal': {
        const goal = nextNode(choice) as Goal;

        return html`<div class="preview">${this.goalTemplate(goal)}</div>`;
      }
      default: {
        const _: never = next; // eslint-disable-line @typescript-eslint/no-unused-vars
      }
    }
  }

  choose(step: Step, choice: Choice) {
    return (e: Event) => {
      e.preventDefault();

      step.choice = choice;

      switch (choice.next.type) {
        case 'question': {
          const question = nextNode(choice) as Question;

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

      this.peekingChoice = undefined;

      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout);
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

function nextNode(choice: Choice): Question | Goal {
  const {next} = choice;

  switch (next.type) {
    case 'question': {
      const question = questions[next.id];

      if (!question) { throw new Error(`undefined question: ${next.id}`); }

      return question;
    }
    case 'goal':
      const goal = goals[next.id];

      if (!goal) { throw new Error(`undefined goal: ${next.id}`); }

      return goal;
    default: {
      const _: never = next; // eslint-disable-line @typescript-eslint/no-unused-vars

      return _;
    }
  }
}
