import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { environment } from "@/infrastructure/config/environment";

const adapter = new PrismaPg({ connectionString: environment.DATABASE_URL });

export const prismaClient = new PrismaClient({ adapter });
