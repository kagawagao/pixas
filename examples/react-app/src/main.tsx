import { createRoot } from 'react-dom/client';
import styles from './index.module.css';

// Render your React component instead
const root = createRoot(document.getElementById('app')!);
root.render(
  <div className={styles.app}>
    <h1>Hello, world!</h1>
  </div>,
);
