import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";
const port: string | number = process.env.PORT || 5000;

(async () => {
  try {
    await prisma.$connect();
    console.log("database connected successfully");
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (err) {
    await prisma.$disconnect();
    console.log("database disconnected");
    process.exit(1);
  }
})();
