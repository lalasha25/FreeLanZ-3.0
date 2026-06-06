import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

function parseDatabaseUrl(url: string) {
  // Parse: mysql://user:password@host:port/database
  const match = url.match(
    /^(?:mysql|mariadb):\/\/([^:@]*)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/(.+)$/,
  );
  if (!match) throw new Error(`Invalid DATABASE_URL format: ${url}`);
  return {
    user: match[1] || 'root',
    password: match[2] || '',
    host: match[3] || 'localhost',
    port: parseInt(match[4] || '3306', 10),
    database: match[5],
    connectionLimit: 5,
  };
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbConfig = parseDatabaseUrl(
      process.env.DATABASE_URL || 'mysql://root:@localhost:3306/freelanz_nest_db',
    );
    const adapter = new PrismaMariaDb(dbConfig);
    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}