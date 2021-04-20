/**
 * 使用方法 node rename.js [path]
 * eg: node rename.js D:\pictures
 * [path] 可以是本地绝对地址，也可以是相对地址
 */


let fs = require('fs');
let path = require('path');
const PATH = path.resolve(__dirname, process.argv.slice(-1)[0]);
/**
 * 
 * @param {String} path 传入的文件夹路径 绝对路径
 * @param {function} callback 回调函数
 */
function walk(path, callback) {
    let files = fs.readdirSync(path);
    files.forEach(file => {
        let way = path + "/" + file;
        if (fs.statSync(way).isDirectory()) {
            walk(way, callback)
            callback(path, file)
        } else {
            callback(path, file)
        }
    })
}

/**
 * 
 * @param {String} oldPath 传入的旧地址
 * @param {String} newPath 修改完的新地址
 */
function rename(oldPath, newPath) {
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.log(err)
        }
    })
}

/**
 * 调用函数
 */
walk(PATH, (path, fileName) => {
    let pointIndex = fileName.lastIndexOf('.');
    let fileType = fileName.substr(pointIndex + 1);
    let filePreName = fileName.substring(0, pointIndex);
    filePreName = filePreName.replace(/\[.*?\]/g, ''); //去除文件名中括号，和之间内容
    filePreName = filePreName.replace(/\(.*?\)/g, ''); //去除文件名小括号，和之间内容
    filePreName = filePreName.replace(/^\s+|\s+$/g, ''); //去除文件名前后空格

    if (!filePreName) { //文件名称不存在 不重命名
        return false;
    }

    let oldPath = path + '/' + fileName;
    let newPath = path + '/' + filePreName + '.' + fileType;
    console.log(oldPath, newPath)
    rename(oldPath, newPath);
})

process.on('exit', (code) => {
    console.log('修改完成')
})