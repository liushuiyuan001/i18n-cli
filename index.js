#!/usr/bin/env node
"use strict";
const fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./src/views/');
var writePath = path.resolve('./src/lang');
var langList = ['cn.json', 'en.json']

// totalObj for write file
var totalObj = {}
var oldObj = require('./src/lang/' + langList[0])

folderView(filePath);

jsonToFile()

function folderView(filePath, fileType = '.vue') {
      //readdirSync
      var files = fs.readdirSync(filePath)
      files.forEach(function (filename) {
            //absoulte fileDir
            var filedir = path.join(filePath, filename);
            //get fs.Stats
            var stats = fs.statSync(filedir)
            var isFile = stats.isFile();//File
            // var isDir = stats.isDirectory();//FileFolder
            if (isFile) {
                  // console.log(filedir);
                  var extname = path.extname(filedir);
                  if (extname === fileType) {
                        // read all content
                        var content = fs.readFileSync(filedir, 'utf-8');
                        var match = content.match(/\$t\((\S*)\)/g)
                        if (match) {
                              writeObj(match)
                        }
                  }
            } else {
                  folderView(filedir);
            }
      });
}

// write content to obj
function writeObj(content) {
      // get string 
      content = content.map(item => item.substring(4, item.length - 2))

      content.forEach(item => {
            let keys = item.split('.')
            // init: one or more category
            keys.reduce((acc,curr,index) => {
                  if(!acc[curr]) {
                     if(index === keys.length - 1){
                        acc[curr] = ''
                     }else {
                        acc[curr] = {}
                     }
                  } 
                  return acc[curr]
            },totalObj) 
      })
}

// write to file
function jsonToFile() {
      if (JSON.stringify(totalObj) === '{}') {
            return
      }

      const mergedObj = Object.assign({},totalObj, oldObj)

      for (const fileName of langList) {
            var absPath = path.join(writePath, fileName);
            fs.writeFileSync(absPath, JSON.stringify(mergedObj, null, '\t'));    
      }
}
