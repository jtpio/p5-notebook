declare module '!!raw-loader!*' {}

declare module '*.ipynb' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare var __webpack_public_path__: string;
