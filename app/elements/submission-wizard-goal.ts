import { LitElement, html } from 'lit';
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
    return this.#section || this.goal?.sections?.[0];
  }

  set section(newVal) {
    const oldVal = this.#section;

    this.#section = newVal;
    this.requestUpdate('section', oldVal);
  }

  render() {
    const {goal} = this;

    if (!goal) { return ''; }

    return html`
      <section class="border scroll-container fade">
        <h1 class="box bg-primary my-0 font-large">📋 ${msg('Submission Instructions')}</h1>

        <nav class="tabs cluster font-large">
          ${goal.sections.map((section) => {
            return html`
              <a @click=${this.selectSection(section)} class="${this.section === section ? 'active' : ''}" href="#">${this.localize(section.title)}</a>
            `;
          })}
        </nav>

        ${this.sectionTemplate()}
      </section>
    `;
  }

  sectionTemplate() {
    if (!this.section) { return ''; }

    const {body} = this.section;

    return html`
      <main ${resetScroll()} class="scroll-pane box-x">
        ${unsafeHTML(this.localize(body))}
      </main>
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
