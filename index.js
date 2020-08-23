#!/usr/bin/env node
"use strict";
const fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./src/views/');
var writePath = path.resolve('./src/lang');
var langList = ['cn.json', 'en.json']

// totalObj for write file
var totalObj = {}

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
      console.log(content)
      // get string 
      content = content.map(item => item.substring(4, item.length - 2))
      console.log(content)

      // console.warn(content)
      content.forEach(item => {
            let temp = item.split('.')
            // one or none category
            if (temp.length === 1) {

                  let cont = temp[temp.length - 1]
                  totalObj[cont] = ''
                  
            } else {
                  
                  let category = temp[0]
                  let cont = temp[temp.length - 1]

                  // write totalObj
                  let second = typeof totalObj[category] === 'undefined' ? {} : totalObj[category]
                  second[cont] = ''
                  totalObj[category] = second
            }
      })
}

// write to file
function jsonToFile() {
      if (JSON.stringify(totalObj) === '{}') {
            return
      }

      for (const fileName of langList) {
            var absPath = path.join(writePath, fileName);
            fs.writeFileSync(absPath, JSON.stringify(totalObj, null, '\t'));    
      }
}
