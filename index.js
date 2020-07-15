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

// 混合并读取 router 文件配置
mixinRouter().then(routers => {
    routers.forEach(routerItem => {
        app.use(routerItem.routes()).use(routerItem.allowedMethods());
    });
});

app.listen(3002);

console.log('listening on port 3002');