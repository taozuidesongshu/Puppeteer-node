const pupp = require('puppeteer')
const config = require('../../config/config')
const { kill_process, autoScroll } = require('../../utils/help')
// const axios = require('axios')
// const cheerio = require('cheerio')

async function gettoutiaoimg(input) {
  //创建实例
  const browser = await pupp.launch(config.browserOption)
  try {
    //新建页签
    const page = await browser.newPage()
    //设置超时
    await page.setDefaultNavigationTimeout(config.timeout)
    //写入请求设备信息
    await page.setUserAgent(config.ua)
    //跳转链接
    await page.goto(`https://www.toutiao.com/search/?keyword=${encodeURI(input.keyword)}`, { 'waitUntil': 'networkidle2' })
    //注入jq
    await page.mainFrame().addScriptTag({
      url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
    })
    //等待2秒
    await page.waitForTimeout(2000)
    //  const ul=await page.jQuery('ul[class=user-list]').text()
    //创建js作用域
    const userEl = await page.evaluate(() => {
      let arr = []
      $('div[class=sections]').find('.img-wrap').each((index, item) => {
        //https://www.toutiao.com/a6775027159615406605/
        let aurl = $(item).attr('href').split('/')[$(item).attr('href').split('/').length - 2]
        arr.push(`https://www.toutiao.com/a${aurl}`)
        console.log(`https://www.toutiao.com/a${aurl}`)
      })
      return arr
    })
    // await context.close();
    return await getimg(userEl, browser)
  } catch (err) {
    return err
  } finally {
    await kill_process(browser)
  }
}

async function getimg(arr = [], browser) {
  let req_arr = []
  let page = await browser.newPage()
  for (let i = 0; i < arr.length; i++) {
    //设置超时
    await page.setDefaultNavigationTimeout(config.timeout)
    //写入请求设备信息
    await page.setUserAgent(config.ua)
    //跳转链接
    await page.goto(`${arr[i]}`, { 'waitUntil': 'networkidle2' })
    //注入jq
    try {
      await page.mainFrame().addScriptTag({
        url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
      })
      // await page.click('.fold-btn-arrow-black')
      // await page.waitForSelector('.cancel', { timeout: 500 })
      // await page.click('.cancel')
      //等待2秒
      await page.waitForTimeout(2000)
      //监听console事件
      page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`${i}: ${msg.args()[i]}`); // 译者注：这句话的效果是打印到你的代码的控制台
      });
      //创建js作用域
      const userEl = await page.evaluate(() => {
        //-------------------------------------
        let totalHeight = 0
        let distance = 100
        let timer = setInterval(() => {
          let scrollHeight = $('article').scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance

          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)

        //------------------------------
        let arr = []
        $('article').find('img').each((index, item) => {
          arr.push($(item).attr('src'))
          console.log(arr)
        })
        return {
          title: document.querySelector('.article__title').innerHTML,
          img_url: arr
        }
      })
      req_arr.push(userEl)
    } catch (err) {
      console.log(err)
      return {
        code: 400,
        msg: '爬取失败',
        errMessage: err
      }
    } finally {
      //关页签
      await page.close()
    }
  }
  console.log(req_arr)
  return req_arr
}

module.exports = async function gettoutiao(ctx) {
  const input = ctx.request.body || ctx.request.query
  if (!input.keyword) {
    ctx.body = {
      code: 405,
      msg: '请求缺少参数',
      data: []
    }
    return
  }
  ctx.body = await gettoutiaoimg(input)
}
