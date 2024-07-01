# `@pixas/bundler-mako`

> mako bundler for pixas

## Installation

```bash
npm install @pixas/bundler-mako --save-dev
```

## Usage

```ts
// pixas.config.ts
export default {
  bundler: 'mako',
};
```

## Notes

### Issues with `CSS Modules` in `mako`

- customize locale class name is not supported, you should use class name as it is.
- named export is not supported, you should use default export.

```css
/* styles.module.css */
.foo {
  color: red;
}

.foo-bar {
  color: blue;
}
```

```ts
// component.ts
import styles from './styles.module.css';

console.log(styles.foo); // worked

console.log(styles['foo-bar']); // worked

console.log(styles['fooBar']); // not worked
```
