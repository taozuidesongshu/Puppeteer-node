const pupp = require('puppeteer')
const config = require('../../config/config')
const { kill_process,autoScroll } = require('../../utils/help')
// const $jquery  = require("puppeteer-jquery");
// const {pageExtend, PageEx} = $jquery;
module.exports = async(ctx) => {
  //创建实例
  const browser = await pupp.launch(config.browserOption)
  console.log(browser)
  try {
    //新建页签
    const page = await browser.newPage()
    // const page = pageExtend(pageOrg);
    //设置超时
    await page.setDefaultNavigationTimeout(config.timeout)
    //写入请求设备信息
    await page.setUserAgent(config.ua)
    //跳转链接
    await page.goto('https://juejin.cn/recommendation/authors/recommended', { 'waitUntil': 'networkidle0' })
    //注入jq
    await page.mainFrame().addScriptTag({
      url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
    })
    //等待2秒
    await page.waitForTimeout(2000)
    //  const ul=await page.jQuery('ul[class=user-list]').text()
    await autoScroll(page)
    //创建js作用域
    const userEl = await page.evaluate(() => {
      let arr = []
      console.log()
      $('ul[class=user-list]').find('li').each((index, item) => {
        arr.push($(item).find('img').attr('src'))
        console.log($(item).find('img').attr('src'))
      })
      return arr
    })
    // await context.close();
    ctx.body = userEl
  } catch(err) {
    ctx.body = err
  } finally {
    await kill_process(browser)
  }

}