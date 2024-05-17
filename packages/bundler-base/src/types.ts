export interface StartOptions {
  port?: number;
  host?: string;
  open?: boolean;
}

export interface IBundler {
  start: (options?: StartOptions) => Promise<void> | void;
  build: () => Promise<void> | void;
}
