#!/usr/bin/env node
"use strict";
const fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./src/views/');
console.log(filePath)
var writePath = path.resolve('./src/lang');
var langList = ['cn.js','en.js']

// totalObj for write file
var totalObj = {}
//调用文件遍历方法
fileDisplay(filePath);
//文件遍历方法
function fileDisplay(filePath,fileType = '.vue'){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(!err){
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(!eror){
                        var isFile = stats.isFile();//是文件
                        // var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            // console.log(filedir);
                            var extname=path.extname(filedir);	 
                              if(extname === fileType){
                              // 读取文件内容
                              var content = fs.readFileSync(filedir, 'utf-8');
                              var match = content.match(/\$t\((\S*)\)/g)
                              if(match){
                                writeObj(match)
                              }
                            }
                        }else{
                          fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}

function writeObj(content){
  // get string 
  content = content.map(item => item.substring(2,item.length - 2))
  // console.warn(content)
  content.forEach(item => {
    let temp = item.split('.')
    let cont = temp[temp.length - 1]
    // filter string taht include `'`
    cont = cont.replace(/\'/,'')
    totalObj[cont] = ''
  })
}

setTimeout(() =>{
  langList.forEach((item) => {
    var absPath = path.join(writePath, item);

    console.log('totalObj',totalObj)
    // append start
    fs.appendFileSync(absPath,'const messages = ')
    fs.appendFileSync(absPath,'\n')
    
    // append obj
    fs.appendFileSync(absPath, JSON.stringify(totalObj, null, '\t'));

    // append end
    fs.appendFileSync(absPath,'\n')
    fs.appendFileSync(absPath,'export default messages')
  })
},3000)


