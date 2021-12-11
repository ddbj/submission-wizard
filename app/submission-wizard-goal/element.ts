import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';

import { Goal, goals } from '../data';
import { LocalizationMixin } from '../localization';

import baseStyle from '../base.css';
import style from './style.css';

@localized()
@customElement('submission-wizard-goal')
export class SubmissionWizardGoal extends LocalizationMixin(LitElement) {
  static styles = [baseStyle, style];

  @property({converter: findGoal})
  goal?: Goal;

  render() {
    const {goal} = this;

    if (!goal) { return ''; }

    return html`
      <div class="border border-rounded scroll-container fade">
        <h1 class="box bg-primary my-0">${msg('Submission Instructions')}</h1>

        <nav class="box border-bottom">
          <ul class="cluster list-unstyled">
            <li>
              <a @click=${this.scrollToSection('overview')} href="#">${msg('Overview')}</a>
            </li>

            ${goal.sections.map(({title}, i) => {
              return html`
                <li>
                  <a @click=${this.scrollToSection(`section-${i}`)} href="#">${this.localize(title)}</a>
                </li>
              `;
            })}
          </ul>
        </nav>

        <main class="scroll-pane box-x">
          <h2 id="overview">${msg('Overview')}</h2>
          <pre>${this.localize(goal.overview)}</pre>

          ${goal.sections.map(({title, body}, i) => {
            return html`
              <h2 id="section-${i}">${this.localize(title)}</h2>
              <pre>${this.localize(body)}</pre>
            `;
          })}
        </main>
      </div>
    `;
  }

  scrollToSection(id: string) {
    return (e: Event) => {
      e.preventDefault();

      this.shadowRoot?.getElementById(id)?.scrollIntoView({block: 'start'});
    };
  }
}

function findGoal(id: string | null, _type?: unknown) {
  return id ? goals[id] : undefined;
}
