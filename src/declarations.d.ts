declare module '!!raw-loader!*' {}

declare module '*.ipynb' {
  const value: string;
  export default value;
}
