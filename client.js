import colors from 'colors'
console.log('Client Server running !!'.inverse.bold)
import axios from 'axios'

const URI = 'http://localhost:5000'

// Populate vs Nesting => Nesting이 5배이상 성능이 향상된다.

const test = async () => {
  console.time('Loading time: ')
  let {
    data: { promotions },
  } = await axios.get(`${URI}/promotion`)

  // console.dir(promotions[3], { depth: 10 })

  // promotions = await Promise.all(
  //   promotions.map(async (promotion) => {
  //     const [res1, res2] = await Promise.all([
  //       axios.get(`${URI}/user/${promotion.user}`),
  //       axios.get(`${URI}/promotion/${promotion._id}/comment`),
  //     ])

  //     promotion.user = res1.data.user
  //     promotion.comments = await Promise.all(
  //       res2.data.comments.map(async (comment) => {
  //         const { data: user } = await axios.get(`${URI}/user/${comment.user}`)

  //         comment.user = user
  //         return comment
  //       })
  //     )

  //     return promotion
  //   })
  // )
  // 콘솔로그에 오브젝으로 표시된 것의 뎁스를 조절하여 Object을 풀어서 보여줌.
  // console.dir(promotions[0], { depth: 10 })
  console.timeEnd('Loading time: ')
}

// Time이 500ms 이하로 떨어져야한다. 이상적으론 200ms 이하

const testGroup = async () => {
  await test()
  await test()
  await test()
  await test()
  await test()
}

testGroup()
