// 写入测试数据
const mongodb = require('./models/db')
mongodb.once('connect', async () => {
   const col = mongodb.col('shop')
   await col.deleteMany()
   const data = new Array(100).fill().map((v, i) => {
      return { id: i, name: 'item' + i, category: Math.random() > 0.5 ? 'apple' : 'banana' }
   })

   await col.insertMany(data)
   console.log('创建数据完成');
})