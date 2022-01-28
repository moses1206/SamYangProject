import faker from 'faker'
import { User } from './src/models/User.js'
import axios from 'axios'

const URI = 'http://localhost:5000'

const generateFakeData = async (
  userCount,
  promotionPerUser,
  commentsPerUser
) => {
  try {
    if (typeof userCount !== 'number' || userCount < 1)
      throw new Error('userCount must be a positive integer')
    if (typeof promotionPerUser !== 'number' || promotionPerUser < 1)
      throw new Error('promotionPerUser must be a positive integer')
    if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
      throw new Error('commentsPerUser must be a positive integer')
    const users = []
    const promotions = []
    const comments = []
    console.log('Preparing fake data.')

    for (let i = 0; i < userCount; i++) {
      users.push(
        new User({
          userId: faker.name.firstName() + parseInt(Math.random() * 100),
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

    console.log('fake data inserting to database...')

    await User.insertMany(users)
    console.log(`${users.length} fake users generated!`)

    users.map((user) => {
      for (let i = 0; i < promotionPerUser; i++) {
        promotions.push(
          axios.post(`${URI}/promotion`, {
            superMarketName: faker.lorem.word(),
            address: faker.address.streetAddress(),
            pos: 3,
            image:
              'https://images.unsplash.com/photo-1641900155667-80fabfe1f42b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80',
            start_date: faker.date.past(),
            end_date: faker.date.recent(),
            promotionType: '전단행사',
            promotionCost: 2500,
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
            islive: true,
            userId: user.id,
          })
        )
      }
    })

    let newPromotions = await Promise.all(promotions)
    console.log(`${newPromotions.length} Fake Promotions generated!`)

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * promotions.length)
        comments.push(
          axios.post(
            `${URI}/promotion/${newPromotions[index].data.promotion._id}/comment`,
            {
              content: faker.lorem.sentence(),
              storeName: faker.lorem.word(),
              userId: user.id,
            }
          )
        )
      }
    })

    await Promise.all(comments)
    console.log(`${comments.length} fake comments generated!`)
    console.log('COMPLETE!!')
  } catch (err) {
    console.log(err)
  }
}

export default generateFakeData
