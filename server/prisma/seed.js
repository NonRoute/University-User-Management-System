// npx prisma db seed
const { PrismaClient } = require('@prisma/client')
const userData = require('./userData')
const courseData = require('./courseData')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const enrollData = require('./enrollData')
const teachData = require('./teachData')

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
  for (const c of courseData) {
    const course = await prisma.course.create({
      data: {
        name: c.name
      }
    })
    console.log(`Created course: ${JSON.stringify(course)}`)
  }
  for (const e of enrollData) {
    const user = await prisma.user.findFirst({ where: { username: e.username } })
    const course = await prisma.course.findFirst({ where: { name: e.courseName } })

    const enrollData = await prisma.enroll.create({
      data: {
        userId: user.id,
        courseId: course.id,
        grade: e.grade
      }
    })
    console.log(`Created enrollment: ${JSON.stringify(enrollData)}`)
  }
  for (const t of teachData) {
    const user = await prisma.user.findFirst({ where: { username: t.username } })
    const course = await prisma.course.findFirst({ where: { name: t.courseName } })

    const teachData = await prisma.teach.create({
      data: {
        userId: user.id,
        courseId: course.id
      }
    })
    console.log(`Created teaching: ${JSON.stringify(teachData)}`)
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
