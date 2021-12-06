import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { configureLocalization, msg, localized } from '@lit/localize';

import * as localeJa from './generated/locales/ja';
import data, { Node, Question, Choice, LocalizedString } from './data';
import { sourceLocale, targetLocales } from './generated/locales';

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
  static styles = css`
    :host {
      --text-color: #1c1b19;
      --link-color: #0d6efd;
      --link-hover-color: #0a58ca;

      color: var(--text-color);
    }

    * {
      margin: 0;
      padding: 0;
    }

    a {
      color: var(--link-color);
    }

    a:hover {
      color: var(--link-hover-color);
    }

    .stack > * + * {
      margin-top: 0.75rem;
    }

    .box {
      padding: 0.75rem 1rem;
    }

    .cluster {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      list-style: none;
    }

    .border {
      border: solid thin var(--text-color);
    }

    .border-top {
      border-top: solid thin var(--text-color);
    }

    .bg-light {
      background-color: hsl(53deg, 100%, 93%);
    }

    .choice-button {
      display: inline-block;
      padding: 0.5em 1.25em;
      border-radius: 0.25rem;
      background-color: hsl(27deg, 100%, 50%);
      color: white !important;
      text-decoration: none;
      transition: background-color .15s;
    }

    .choice-button:hover {
      background-color: hsl(27deg, 100%, 45%);
    }
  `;

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
  answers: [Question, Choice][]  = [];

  @state()
  currentNode: Node = data.q1;

  render() {
    return html`
      <div class="stack border">
        ${this.renderAnswers()}
        ${this.renderCurrentNode()}
      </div>
    `;
  }

  renderAnswers() {
    return this.answers.map(([question, choice]) => {
      return html`
        <div>
          <p class="box bg-light">${this.localize(question.text)}</p>

          <p class="box">
            ${this.localize(choice.label)}
            <small><a @click=${this.backTo(question)} href="#">${msg('Change')}</a></small>
          </p>
        </div>
      `;
    });
  }

  renderCurrentNode() {
    switch (this.currentNode.type) {
      case 'question': {
        const question = this.currentNode;

        return html`
          <div>
            <p class="box bg-light">${this.localize(question.text)}</p>

            <ul class="box cluster">
              ${question.choices.map((choice: Choice) => {
                return html`
                  <li>
                    <a @click=${this.answer(question, choice)} href="#" class="choice-button">${this.localize(choice.label)}</a>
                  </li>
                `;
              })}
            </ul>
          </div>
        `;
      }
      case 'result': {
        const {repository} = this.currentNode;

        return html`
          <div class="box border-top">
            <p>✅ ${msg('You can submit your data to the following database:')}</p>
            <a href=${repository.url}>${repository.name}</a> - ${repository.description}
          </div>
        `;
      }
      default: {
        const _: never = this.currentNode; // eslint-disable-line @typescript-eslint/no-unused-vars
      }
    }
  }

  answer(question: Question, choice: Choice) {
    return (e: Event) => {
      e.preventDefault();

      this.answers.push([question, choice]);
      this.currentNode = data[choice.next];
    }
  }

  backTo(question: Question) {
    return (e: Event) => {
      e.preventDefault();

      const i = this.answers.findIndex(([q]) => q === question);

      this.answers.splice(i);
      this.currentNode = question;
    }
  }

  localize(source: LocalizedString): string {
    return source[this.locale];
  }
}
