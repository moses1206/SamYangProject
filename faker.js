import faker from 'faker'
import { User } from './src/models/User.js'
import { Promotion } from './src/models/Promotion.js'
import { Comment } from './src/models/Comment.js'

const generateFakeData = async (
  userCount,
  promotionPerUser,
  commentsPerUser
) => {
  if (typeof userCount !== 'number' || userCount < 1)
    throw new Error('userCount must be a positive integer')
  if (typeof promotionPerUser !== 'number' || promotionPerUser < 1)
    throw new Error('blogsPerUser must be a positive integer')
  if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
    throw new Error('commentsPerUser must be a positive integer')
  const users = []
  const promotions = []
  const comments = []
  console.log('Preparing fake data.')

  for (let i = 0; i < userCount; i++) {
    users.push(
      new User({
        userId: faker.name.firstName() + parseInt(Math.random() * 10000000000),
        password: faker.internet.password(),
        channel: faker.lorem.word(),
        storeName: faker.lorem.word(),
        phoneNumber: faker.phone.phoneNumber(),
        userImage:
          'https://images.unsplash.com/photo-1641900155667-80fabfe1f42b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80',
        address: {
          warehouse: faker.address.streetAddress(),
          lat: faker.address.latitude(),
          lng: faker.address.longitude(),
        },
      })
    )
  }

  users.map((user) => {
    for (let i = 0; i < promotionPerUser; i++) {
      promotions.push(
        new Promotion({
          superMarketName: faker.lorem.word(),
          address: faker.address.streetAddress(),
          pos: faker.finance.account(),
          image:
            'https://images.unsplash.com/photo-1641900155667-80fabfe1f42b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80',
          start_date: faker.date.past(),
          end_date: faker.date.recent(),
          promotionType: '전단행사',
          promotionCost: faker.commerce.price(),
          promotionDetail: [
            {
              productName: faker.commerce.productName(),
              price: faker.commerce.price(),
              sellValue: 20,
              prValue: 4,
            },
            {
              productName: '불닭볶음면',
              price: 1500,
              sellValue: 20,
              prValue: 4,
            },
            {
              productName: '나가사끼짬뽕',
              price: 1500,
              sellValue: 20,
              prValue: 4,
            },
          ],

          user: user,
        })
      )
    }
  })

  users.map((user) => {
    for (let i = 0; i < commentsPerUser; i++) {
      let index = Math.floor(Math.random() * promotions.length)
      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          storeName: faker.lorem.word(),
          user,
          promotion: promotions[index]._id,
        })
      )
    }
  })

  console.log('fake data inserting to database...')
  await User.insertMany(users)
  console.log(`${users.length} fake users generated!`)
  await Promotion.insertMany(promotions)
  console.log(`${promotions.length} fake promotions generated!`)
  await Comment.insertMany(comments)
  console.log(`${comments.length} fake comments generated!`)
  console.log('COMPLETE!!')
}

export default generateFakeData
