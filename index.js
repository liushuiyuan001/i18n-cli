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

fileDisplay(filePath);
//文件遍历方法
function fileDisplay(filePath,fileType = '.vue'){
    //readdirSync
    var files = fs.readdirSync(filePath)
    files.forEach(function(filename){
      //absoulte fileDir
      var filedir = path.join(filePath, filename);
      //get fs.Stats
      var stats = fs.statSync(filedir)
      var isFile = stats.isFile();//File
      // var isDir = stats.isDirectory();//FileFolder
      if(isFile){
        // console.log(filedir);
        var extname=path.extname(filedir);	 
          if(extname === fileType){
          // read all content
          var content = fs.readFileSync(filedir, 'utf-8');
          var match = content.match(/\$t\((\S*)\)/g)
          if(match){
            writeObj(match)
          }
        }
      }else{
        fileDisplay(filedir);
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
    // one or none category
    if(temp.length === 1){
      let cont = temp[temp.length - 1]
      // filter string taht include `'`
      cont = cont.replace(/\(/,'')
      cont = cont.replace(/\'/,'')
  
      if(!(cont in json)){
        totalObj[cont] = ''
      }
    }else{
      let category = temp[0]
      category = category.replace(/\(/,'')
      category = category.replace(/\'/,'')

      let cont = temp[temp.length - 1]
      // filter string taht include `'`
      cont = cont.replace(/\(/,'')
      cont = cont.replace(/\'/,'')
      
      // if category or cont no exist to write totalObj
      if(!(category in json) || !(cont in json[category])){
        let second =  typeof totalObj[category] === 'undefined' ? {} : totalObj[category]
        second[cont] = ''
        totalObj[category] = second
      }

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
    var newObj = mergeObject(json,totalObj)
    fs.writeFileSync(absPath, JSON.stringify(newObj, null, '\t'));
  })
}



function mergeObject(FirstObj, SecondObj) { // 深度合并对象
  for (var key in SecondObj) {
      FirstObj[key] = FirstObj[key] && FirstObj[key].toString() === "[object Object]" ?
          mergeObject(FirstObj[key], SecondObj[key]) : FirstObj[key] = SecondObj[key];
  }
  return FirstObj;
}


