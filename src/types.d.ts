declare module '*.css' {
  const data: string;

  export default data;
}

declare module '*.yml' {
  const data: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  export default data;
}
