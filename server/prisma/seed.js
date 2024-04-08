// npx prisma db seed
const { PrismaClient } = require('@prisma/client')
const userData = require('./userData')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function main() {
  console.log(`Start seeding ...`)
  await prisma.enroll.deleteMany({})
  await prisma.teach.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.user.deleteMany({})
  console.log(`Deleted all data`)
  for (const u of userData) {
    const salt = await bcrypt.genSalt(10)
    hashedPassword = await bcrypt.hash(u.password, salt)
    const user = await prisma.user.create({
      data: {
        username: u.username,
        password: hashedPassword,
        role: u.role
      }
    })
    console.log(`Created user: ${JSON.stringify(user)}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
