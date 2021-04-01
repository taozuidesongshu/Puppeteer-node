const path = require('path')
const puppeteer = require('puppeteer')
const config = {
  browserOption: {
    headless: Boolean(process.env.MSF_ENV === 'docker'),
    // slowMo: process.env.MSF_ENV === 'docker' ? 0 : 200,
    devtools: Boolean(process.env.MSF_ENV !== 'docker'),
    // timeout: 6000000, // 1000 * 6000
    defaultViewport: {
      width: 1280,
      height: 700
    },
    ignoreHTTPSErrors: true,
    pipe: true, // 不使用websocket
    // dumpio: true, // 是否将浏览器进程标准输出和标准错误输入到 process.stdout 和 process.stderr 中。默认是 false。(有点坑、只要页面出错就会一直打开)
    // args: process.env.NODE_ENV === 'develop' ? [
    args: Boolean(process.env.MSF_ENV === 'docker') ? [
      // '--proxy-server=socks5://190.168.0.103:1080'
      '--no-sandbox', // 禁用沙箱
      '--disable-setuid-sandbox', // 禁用setuid沙箱(仅限Linux)
      '--headless', // 运行无头模式
      '--no-zygote', // 禁用分发子进程
      '--disable-gpu', // 禁用gpu
      '--no-first-run', // 跳过首次运行
      '--disable-dev-shm-usage' // 始终使用临时目录创建匿名共享内存文件
      // '--single-process', // 单进程
      // '--disable-web-security' // 不执行同源策略
    ] : [
        // '--proxy-server=socks5://190.168.3.159:1080',
        '--no-sandbox', // 禁用沙箱
        '--disable-setuid-sandbox',
        '--disable-features=site-per-process'
      ],
    // executablePath: () => {
    //   const isPkg = typeof process.pkg !== 'undefined'
    //   // mac path replace
    //   let chromiumExecutablePath = (isPkg ? puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium')) : puppeteer.executablePath())
    //   // check win32
    //   // process.platform 返回值有: aix darwin freebsd linux openbsd sunos win32
    //   // if (process.platform === 'win32') {
    //   //   chromiumExecutablePath = (isPkg ? puppeteer.executablePath().replace(/^.*?\\node_modules\\puppeteer\\\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium')) : puppeteer.executablePath()
    //   //   )
    //   // }
    //   return chromiumExecutablePath
    // }// 引用本地依赖chromium
  },
  /**
* 设置超时时间
*/

  timeout: 6000000, // 1000 * 6000
  /**
 * 设置puppeteer中的ua
*/

  ua: Boolean(process.env.MSF_ENV === 'docker') ?
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17' :
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    //'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',

    'env': 'production',

    deviceId: 'a193f85f-3520-42e2-8d3c-7b68ccab17ef'
  }


  module.exports = config