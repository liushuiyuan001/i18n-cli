#!/usr/bin/env node
"use strict";
const fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./src/views/');
var writePath = path.resolve('./src/lang');
var langList = ['cn.json','en.json']


var json = require('./src/lang/' + langList[0])
// totalObj for write file
var totalObj = {}
//调用文件遍历方法
fileDisplay(filePath);
//文件遍历方法
function fileDisplay(filePath,fileType = '.vue'){
    //根据文件路径读取文件，返回文件列表(同步)
    var files = fs.readdirSync(filePath)
    files.forEach(function(filename){
      //获取当前文件的绝对路径
      var filedir = path.join(filePath, filename);
      //根据文件路径获取文件信息，返回一个fs.Stats对象
      var stats = fs.statSync(filedir)
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
    });
}
// whiter content to obj
function writeObj(content){
  // get string 
  content = content.map(item => item.substring(2,item.length - 2))
  // console.warn(content)
  content.forEach(item => {
    let temp = item.split('.')
    let cont = temp[temp.length - 1]
    // filter string taht include `'`
    cont = cont.replace(/\(/,'')
    cont = cont.replace(/\'/,'')

    if(!(cont in json)){
      totalObj[cont] = ''
    }
  })
}
//write to file
objToFiles()
function objToFiles(){
  if(JSON.stringify(totalObj) === '{}'){
    return
  }
  langList.forEach((item) => {
    var absPath = path.join(writePath, item);
    // append obj
    var newObj = Object.assign(json,totalObj)
    fs.writeFileSync(absPath, JSON.stringify(newObj, null, '\t'));
  })
}




