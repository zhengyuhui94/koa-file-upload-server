const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
// 混合配置
const mixinRouter = require('./mixin/router');

// 解析 post 请求参数，包含上传的文件
app.use(koaBody({
    multipart: true, // 支持文件上传
    // encoding: 'gzip',
    formidable: {
        // uploadDir: path.join(__dirname,'static/image/'), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 20 * 1024 * 1024 // 文件上传大小
        // onFileBegin(name, file){ // 文件上传前的设置
        //     console.log(`上传文件前的设置：${name}`);
        //     console.log(file);
        // }
    }
}));

// 设置跨域中间件，需要设置在所有响应之前
app.use(async (ctx, next) => {
    // 解决跨域的 origin
    // 当设置 Access-Control-Allow-Credentials 为 true 时，必须要指定特定的跨域 origin，
    // 不能设置为 *
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    // 允许跨域时，获取客户端域名的 cookie
    ctx.set('Access-Control-Allow-Credentials', true);
    // 跨域时携带的参数类型默认只能解析以下三种MIME类型：
    // application/x-www-form-urlencoded、multipart/form-data 或 text/plain 
    // 不包括参数，即 application/json，如果要支持的话，需要添加该响应头
    ctx.set('Access-Control-Allow-Headers', 'content-type');
    // 允许的跨域方法
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH');
    await next();
});

// 混合并读取 router 文件配置
mixinRouter().then(routers => {
    routers.forEach(routerItem => {
        app.use(routerItem.routes()).use(routerItem.allowedMethods());
    });
});

app.listen(3002);

console.log('listening on port 3002');