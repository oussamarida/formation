import oracledb from "oracledb";

const poolConfig: oracledb.PoolAttributes = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  poolMin: Number(process.env.ORACLE_POOL_MIN ?? 1),
  poolMax: Number(process.env.ORACLE_POOL_MAX ?? 10),
  poolIncrement: 1,
};

let poolInitialized = false;

// Crée le pool de connexions Oracle au démarrage
export async function initOraclePool(): Promise<void> {
  if (poolInitialized) return;

  const { user, password, connectString } = poolConfig;
  if (!user || !password || !connectString) {
    throw new Error(
      "Missing Oracle config: set ORACLE_USER, ORACLE_PASSWORD, and ORACLE_CONNECT_STRING"
    );
  }

  await oracledb.createPool(poolConfig);
  poolInitialized = true;
}

// Retourne le pool Oracle actif
export function getPool(): oracledb.Pool {
  if (!poolInitialized) {
    throw new Error("Oracle pool not initialized. Call initOraclePool() first.");
  }
  return oracledb.getPool();
}

// Obtient une connexion depuis le pool Oracle
export async function getConnection(): Promise<oracledb.Connection> {
  return getPool().getConnection();
}

// Exécute une requête SQL et retourne les lignes résultat
export async function executeQuery<T = Record<string, unknown>>(
  sql: string,
  binds: oracledb.BindParameters = {},
  options: oracledb.ExecuteOptions = {}
): Promise<T[]> {
  const connection = await getConnection();

  try {
    const result = await connection.execute<T>(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options,
    });
    return (result.rows ?? []) as T[];
  } finally {
    await connection.close();
  }
}

// Ferme le pool de connexions Oracle
export async function closeOraclePool(): Promise<void> {
  if (!poolInitialized) return;

  await oracledb.getPool().close(0);
  poolInitialized = false;
}
