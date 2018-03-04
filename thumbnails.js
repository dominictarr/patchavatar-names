var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')

var canvas = document.createElement('canvas')
canvas.width = 50
canvas.height = 50

var ctx = canvas.getContext('2d')

var crypto = require('crypto')
function hash(str) {
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 32)
}

// TODO support more than one size of thumbnail
// (pass the size we want the thumbnail to be in)

module.exports = function onThumbnail (src, fn) {
  var id = hash(src)
  var dir = path.join(process.env.HOME, '.' + (process.env.ssb_appname || 'ssb'), 'thumbnails')
  var filename = path.join(dir, id.substring(0, 2), id.substring(2, 32))
  fs.stat(filename, function (err) {
    if(!err) return fn(filename)

    var img = document.createElement('img')
    img.src = src
    img.onload = function () {
      var size = Math.min(img.width, img.height)
      ctx.drawImage(img, (img.width - size)/2, (img.height - size)/2, size, size, 0, 0, canvas.width, canvas.height)
      var data = canvas.toDataURL('image/jpg')
      img.src = null
      img = null
      mkdirp(path.dirname(filename), function (err) {
        data = data.substring(data.indexOf(',')+1)

        fs.writeFile(filename, new Buffer(data, 'base64'), function (err) {
          if(!err) fn(filename)
        })
      })
    }
  })
}

