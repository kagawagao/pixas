import { createRoot } from 'react-dom/client';
import styles from './index.module.css';

console.log(process.env.APP_ID);

// Render your React component instead
const root = createRoot(document.getElementById('app')!);
root.render(
  <div className={styles.app}>
    <h1>Hello, world!</h1>
  </div>,
);
