import { LitElement, html } from 'lit';
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
      ${this.renderAnswers()}
      ${this.renderCurrentNode()}
    `;
  }

  renderAnswers() {
    return this.answers.map(([question, choice]) => {
      return html`
        <p>
          ${this.localize(question.text)}: ${this.localize(choice.label)}
          <small>(<a @click=${this.backTo(question)} href="#">${msg('Change')}</a>)</small>
        </p>
      `;
    });
  }

  renderCurrentNode() {
    switch (this.currentNode.type) {
      case 'question':
        const question = this.currentNode;

        return html`
          <p>${this.localize(question.text)}</p>

          <ul>
            ${question.choices.map((choice: Choice) => {
              return html`
                <li>
                  <a @click=${this.answer(question, choice)} href="#">${this.localize(choice.label)}</a>
                </li>
              `;
            })}
          </ul>
        `;
      case 'result':
        const {repository} = this.currentNode;

        return html`
          <hr>

          <p>${msg('You can submit your data to the following database:')}</p>
          <a href=${repository.url}>${repository.name}</a> - ${repository.description}
        `;
      default:
        const _: never = this.currentNode;
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

      const i = this.answers.findIndex(([q, _]) => q === question);

      this.answers.splice(i);
      this.currentNode = question;
    }
  }

  localize(source: LocalizedString): string {
    return source[this.locale];
  }
}
