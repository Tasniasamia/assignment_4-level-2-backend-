// import "dotenv/config";
// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from "../../generated/prisma/client";

// const connectionString = `${process.env.DATABASE_URL}`

// const adapter = new PrismaPg({ connectionString })
// const prisma = new PrismaClient({ adapter })

// export { prisma }

import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";

// Single instance of PrismaClient for the whole project
export const prisma = new PrismaClient();
