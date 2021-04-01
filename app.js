const koa=require('koa')
const Router = require('./router')
const cors = require('koa2-cors')
const app=new koa()
// app.use(async (ctx,next)=>{
//   // console.log(ctx)
//   next()
// })
app.use(cors({
  origin: '*',
  credentials: true,
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  allowMethods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
  allowHeaders: ['x-requested-with', 'accept', 'origin', 'content-type'],
  maxAge: 1728000
}))
// app.use(async(ctx, next) => {
//     // console.log(ctx.req)
//     if (ctx.request.header.origin !== ctx.origin) {
//       ctx.set('Access-Control-Allow-Origin', '*')
//       ctx.set('Access-Control-Allow-Credentials', true)
//     }

//     await next()
//   })




app.use(Router)

//日志输出
app.use(async(ctx)=>{
  console.log(`
  ====================错误日志========================
   method :${ctx.request.method}
   url:${ctx.request.url}
   meg:${JSON.stringify(ctx.request.body||ctx.query)}
  ====================错误日志======================
  `)
})


app.listen(8000,()=>{
    console.log(`
    -------------------------
    服务启动 端口8000
    -------------------------
    `)
})
