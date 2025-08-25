import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';

let container: StartedTestContainer;
let prisma: PrismaClient;

export async function startDb() {
  container = await new GenericContainer('postgres:16-alpine')
    .withEnv('POSTGRES_PASSWORD', 'password')
    .withEnv('POSTGRES_USER', 'postgres')
    .withEnv('POSTGRES_DB', 'testdb')
    .withExposedPorts(5432)
    .start();

  const port = container.getMappedPort(5432);
  process.env.DATABASE_URL = `postgresql://postgres:password@localhost:${port}/testdb?schema=public`;

  // run prisma migrate deploy here (child_process spawn) then:
  prisma = new PrismaClient();
  return { prisma };
}

export async function stopDb() {
  await prisma?.$disconnect();
  await container?.stop();
}
