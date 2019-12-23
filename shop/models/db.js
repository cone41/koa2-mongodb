const conf = require('../util/conf')
const EventEmitter = require('events').EventEmitter;
const MongoClient = require('mongodb').MongoClient
class Mongodb {
   constructor() {
      this.conf = conf;
      this.emitter = new EventEmitter()
      this.client = new MongoClient(conf.url, { useNewUrlParser: true, useUnifiedTopology: true })
      // 创建连接
      this.client.connect((err) => {
         if (err) {
            throw err
         }
         // 连接成功后广播事件
         this.emitter.emit('connect')
      })
   }

   // 创建表
   col(colName, dbName = conf.dbName) {
      return this.client.db(dbName).collection(colName)
   }

   once(event, cb) {
      // 接收广播事件，连接上之后做的事情放在 callback里
      this.emitter.once(event, cb)
   }
}

module.exports = new Mongodb()