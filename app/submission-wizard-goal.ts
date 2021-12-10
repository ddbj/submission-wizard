import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';

import style from './style';
import { Goal, goals } from './data';
import { LocalizationMixin } from './localization';

@localized()
@customElement('submission-wizard-goal')
export class SubmissionWizardGoal extends LocalizationMixin(LitElement) {
  static styles = style;

  @property({converter: findGoal})
  goal?: Goal;

  render() {
    const {goal} = this;

    if (!goal) { return ''; }

    return html`
      <div class="box border rounded">
        <h1>${msg('Submission Instructions')}</h1>

        <h2>${msg('Overview')}</h2>
        <pre>${this.localize(goal.overview)}</pre>

        ${goal.sections.map(({title, body}) => {
          return html`
            <h2>${this.localize(title)}</h2>
            <pre>${this.localize(body)}</pre>
          `;
        })}
      </div>
    `;
  }
}

function findGoal(id: string | null, _type?: unknown) {
  return id ? goals[id] : undefined;
}
