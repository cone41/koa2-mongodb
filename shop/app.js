const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const path = require('path')
const views = require('koa-views')
const mongodb = require('./models/db')
const qs = require('qs')

app.use(views(__dirname, { extension: 'html' }))

router.get('/', async ctx => {
   await ctx.render('index.html')
})

router.get('/shop/list', async ctx => {
   // 获取参数
   const { pageNo, pageSize, category, keyword } = qs.parse(ctx.url.split('?')[1])
   const col = mongodb.col('shop')
   const condition = {}
   if (category) {
      condition.category = category
   }
   if (keyword) {
      condition.name = { $regex: new RegExp(keyword) }
   }
   // 总长度
   const total = await col.find(condition).count()
   // skip ==> 跳过指定数量的数据，接受一个数字参数作为跳过的记录条数。
   // limit ==> 接受一个数字参数，该参数指定从MongoDB中读取的记录条数。
   const data = await col.find(condition).skip((pageNo - 1) * pageSize).limit(Number(pageSize)).toArray()
   console.log(data)
   ctx.response.body = {
      total: total,
      data: data
   }
})

router.get('/shop/category', async ctx => {
   const col = mongodb.col('shop')
   // 获取某个字段的唯一值，仅可对单一字段去重。
   const data = await col.distinct('category')
   console.log(data);
   ctx.response.body = {
      status: 200,
      data
   }
})

// router.get('/shop/category/filter/:categoryId', async ctx => {
//    const { categoryId } = ctx.params
//    const col = mongodb.col('shop')
//    const data = await col.find({ category: categoryId })
//    console.log(data);

// })



app.use(router.routes())

app.listen(8080, () => {
   console.log(' 成功监听 8080');
})