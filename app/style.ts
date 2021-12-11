import { css } from 'lit';

export default css`
  :host {
    --text-color: #1c1b19;
    --link-color: #0d6efd;
    --link-hover-color: #0a58ca;
    --border-radius: 0.25rem;

    color: var(--text-color);
  }

  a {
    color: var(--link-color);
  }

  a:hover {
    color: var(--link-hover-color);
  }

  [class^='stack'] > * {
    margin-top: 0;
    margin-bottom: 0;
  }

  .stack-large > * + * {
    margin-top: 1rem;
  }

  .stack-small > * + * {
    margin-top: 0.25rem;
  }

  .box {
    padding: 0.75rem 1rem;
  }

  .box-x {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .box-y {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .box > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  .box > *:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .cluster {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .cluster.wide {
    gap 1rem 2rem;
  }

  .border {
    border: solid thin var(--text-color);
  }

  .border-bottom {
    border-bottom: solid thin var(--text-color);
  }

  .border.rounded {
    border-radius: var(--border-radius);
  }

  .border.rounded > *:first-child {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .border.rounded > *:last-child {
    border-bottom-right-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }

  .list-unstyled {
    padding-left: 0;
    list-style: none;
  }

  .bg-primary {
    background-color: hsl(53deg, 100%, 93%);
  }

  .my-0 {
    margin-top: 0;
    margin-bottom: 0;
  }

  .pb-0 {
    padding-bottom: 0;
  }
`;
