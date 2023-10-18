export const log = (msg: string) => {
  const now = new Date().toLocaleString();
  console.log(`${now}: ${msg}`);
};
