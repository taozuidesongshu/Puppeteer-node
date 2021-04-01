const router = require('koa-router')()
const koa2Req = require('koa-request')
const axios = require('axios')
const bodyParser = require('koa-body')
const cheerio = require('cheerio')
router.get('/', async(ctx, next) => {
  ctx.body = `<h1>hello,koa666666666666</h1>`
})
router.get('/img', async(ctx, next) => {
  let p = ctx.query.p || 1
  let res = await axios({
    method: 'get',
    url: `https://bing.ioliu.cn/?p=${p}`
  })
  let $ = await cheerio.load(res.data)
  let res_list = []
  $('.container .item').each((index, item) => {
    //console.log($(item).find('img').attr('src'))
    // console.log(item.find('img'))
    res_list.push($(item).find('img').attr('src'))


  })
  // console.log(res_list)
  ctx.body = res_list
})
router.get('/img1', async(ctx, next) => {
  console.log(ctx.query)
  let p = ctx.query.p || 1
  let res = await axios({
    method: 'get',
    url: `https://bing.ioliu.cn/?p=${p}`
  })
  let $ = await cheerio.load(res.data)
  let res_list = []
  $('.container .item').each((index, item) => {
    //console.log($(item).find('img').attr('src'))
    // console.log(item.find('img'))
    let img = `<img src="${$(item).find('img').attr('src')}" >`
    res_list += img
  })
  // console.log(res_list)
  ctx.response.type = 'text/html;charset=utf-8'
  ctx.response.body = res_list
})
router.get('/img2', async(ctx, next) => {
  let p = ctx.query.p || 1
  let res = await axios({
    method: 'get',
    url: `https://bing.ioliu.cn/?p=${p}`
  })
  let imgReg = /<img.*?(?:>|\/>)/gi
  let img = res.data.match(imgReg)
  console.log(img)
  ctx.response.type = 'text/html;charset=utf-8'
  ctx.response.body = img
})
//爬掘金
router.get('/juejing/zuozhe', require('../controllers/juejing/juejing'))
//爬今日头条
router.get('/jinritoutiao/img', require('../controllers/jinritoutiao/jinritoutiao'))


module.exports = router.routes()

