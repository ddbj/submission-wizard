import { css } from 'lit';

export default css`
  :host {
    --max-height: calc(100vh - 2rem);
  }

  .scroll-container {
    display: flex;
    flex-direction: column;
    max-height: var(--max-height);
  }

  .scroll-pane {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    scroll-padding-top: 1rem;
    scroll-behavior: smooth;
    flex: 1;
  }

  h1 {
    font-size: 1.75em;
  }
`;
