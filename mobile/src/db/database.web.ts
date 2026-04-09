export async function getDatabase(): Promise<never> {
  throw new Error('SQLite offline/indisponivel na Web.');
}

export default { getDatabase };
