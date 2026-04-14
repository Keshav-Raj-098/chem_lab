// test.js
const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.researchProjects.findMany();
  console.log("Total projects:", projects.length);
  projects.forEach(p => console.log(`- ${p.title} | Status: ${p.status} | amntFunded: ${p.amntFunded}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
