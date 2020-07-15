const Router = require('koa-router');
const path = require('path');
const fs = require('fs');

const router = new Router({
    prefix: '/upload'
});

router.post('/uploadfile', async (ctx, next) => {
    // 获取上传文件
    const file = ctx.request.files.file;
    let fileDirType = 'image';

    // 根据文件类型存储到不同资源目录下
    // 图片
    if(file.type.indexOf('image') !== -1){
        fileDirType = 'image';
    }

    // 创建可读流，读取指定 file.path 的文件
    const readStream = fs.createReadStream(file.path);
    // 存储文件的目录
    let fileDirPath = `/usr/local/files/${fileDirType}`;
    // 存储的文件名
    let fileName = `${Date.now()}_${file.name}`;
    // 存储的文件完整路径
    let filePath = `${fileDirPath}/${fileName}`;
    // 文件存储的可访问的远程服务路径
    let remoteFilePath = `http://81.70.15.16/files/${fileDirType}/${filePath}`;
    // 创建可写流，写入到指定 filePath 的文件
    let writeStream = fs.createWriteStream(filePath);
    // 将文件的可读流通过管道流入到可写流的来源流中
    readStream.pipe(writeStream);
    // 给前端返回响应数据
    ctx.body = {
        code: 0,
        data: remoteFilePath,
        msg: '上传成功'
    }

    await next();
});

module.exports = router;