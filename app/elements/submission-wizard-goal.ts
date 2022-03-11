import { LitElement, html, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import resetScroll from '../directives/reset-scroll';
import { Goal, Section, findGoal } from '../data/goal';
import { LocalizationMixin } from '../localization';

import baseStyle from './base.css';
import style from './submission-wizard-goal.css';

@localized()
@customElement('submission-wizard-goal')
export class SubmissionWizardGoal extends LocalizationMixin(LitElement) {
  static styles = [baseStyle, style];

  @property({converter: findGoalIf})
  goal?: Goal;

  #section?: Section;

  @state()
  get section() {
    return this.#section || this.goal?.sections[0];
  }

  set section(newVal) {
    const oldVal = this.#section;

    this.#section = newVal;
    this.requestUpdate('section', oldVal);
  }

  @state()
  get previousSection() {
    const {goal, section} = this;

    if (!goal || !section) { return undefined; }

    const i = goal.sections.indexOf(section);

    return i <= 0 ? undefined : goal.sections[i - 1];
  }

  @state()
  get nextSection() {
    const {goal, section} = this;

    if (!goal || !section) { return undefined; }

    const i = goal.sections.indexOf(section);

    return i === -1 || i >= goal.sections.length ? undefined : goal.sections[i + 1];
  }

  render() {
    const {goal} = this;

    if (!goal) { return ''; }

    return html`
      <div class="container border fade">
        <h1 class="box bg-primary my-0 font-large">
          ${databaseIcon} ${msg('Submission Instructions')}
        </h1>

        <nav class="box tabs font-heading font-large">
          ${goal.sections.map((section) => {
            return html`
              <a @click=${this.selectSection(section)} class="${this.section === section ? 'active' : ''}" href="#">${this.localize(section.title)}</a>
            `;
          })}
        </nav>

        <main ${resetScroll()} class="box vstack">
          ${this.sectionTemplate()}
        </main>
      </div>
    `;
  }

  sectionTemplate() {
    if (!this.section) { return ''; }

    const {body} = this.section;

    return html`
      <div class="no-margin-around-y">
        ${unsafeHTML(this.localize(body))}
      </div>

      <nav class="space-between">
        <div>
          ${this.sectionLinkTemplate(`« ${msg('Prev')}`, this.previousSection)}
        </div>

        <div>
          ${this.sectionLinkTemplate(`${msg('Next')} »`, this.nextSection)}
        </div>
      </nav>
    `;
  }

  sectionLinkTemplate(label: string, section?: Section) {
    if (!section) { return ''; }

    return html`
      <a @click=${this.selectSection(section)} href="#">${label}</a>
    `;
  }

  selectSection(section: Section) {
    return (e: Event) => {
      e.preventDefault();

      this.section = section;
    }
  }
}

function findGoalIf(id: string | null) {
  return id ? findGoal(id) : undefined;
}

// Health Icons (https://healthicons.org/)
// License: MIT
const databaseIcon = svg`<svg class="icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M39 9.75V16.1786C39 18.2496 32.2843 19.9286 24 19.9286C15.7157 19.9286 9 18.2496 9 16.1786V9.75C9 7.67893 15.7157 6 24 6C32.2843 6 39 7.67893 39 9.75ZM9.62114 19.7144C11.4651 21.2634 17.2049 22.393 24 22.393C30.7951 22.393 36.5349 21.2634 38.3789 19.7144C38.783 20.0538 39 20.4134 39 20.7857V27.2143C39 29.2853 32.2843 30.9643 24 30.9643C15.7157 30.9643 9 29.2853 9 27.2143V20.7858C9.00002 20.4135 9.21703 20.0538 9.62114 19.7144ZM24 33.6786C17.205 33.6786 11.4652 32.549 9.62118 31C9.21703 31.3395 9 31.6991 9 32.0714V38.5C9 40.5711 15.7157 42.25 24 42.25C32.2843 42.25 39 40.5711 39 38.5V32.0714C39 31.6991 38.783 31.3395 38.3788 31C36.5348 32.549 30.795 33.6786 24 33.6786ZM32.3333 37.3333C32.3333 37.9777 31.811 38.5 31.1667 38.5C30.5223 38.5 30 37.9777 30 37.3333C30 36.689 30.5223 36.1667 31.1667 36.1667C31.811 36.1667 32.3333 36.689 32.3333 37.3333ZM35.8333 37.3333C36.4777 37.3333 37 36.811 37 36.1667C37 35.5223 36.4777 35 35.8333 35C35.189 35 34.6667 35.5223 34.6667 36.1667C34.6667 36.811 35.189 37.3333 35.8333 37.3333Z" fill="#333333"/></svg>`;
