// 杀死模拟浏览器进程
async function kill_process(browser) {
  if (process.env.MSF_ENV) {
    await browser.process().kill('SIGHUP')
  } else {
    await browser.process().kill()
  }
}
//滚动页面
async function autoScroll(page){
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}


module.exports ={
  kill_process,
  autoScroll
}