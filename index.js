var ref = require('ssb-ref')

exports.needs = {
  sbot: {
    friends: { get: 'first' },
    names: { getSignifier: 'first', getImageFor: 'first'}
  },
  identity: {
    main: 'first'
  }
}

exports.gives = {
  avatar: {
    image: true,
    name: true
  }
}

var onThumbnail = require('./thumbnails')

exports.create = function (api) {
  var friends, names, wait = []
  return {
    avatar: {
      image: function (id, onImage) {
        if('function' !== typeof onImage) throw new Error('should be a function, was:'+onImage)
        api.sbot.names.getImageFor(id, function (err, blob) {
          onThumbnail('http://localhost:8989/blobs/get/'+blob, onImage)
        })
      }, //fall through...
      name: function (id) {
        var span = document.createElement('span')
        span.title = id
        api.sbot.names.getSignifier(id, function (err, name) {
          span.textContent = name
        })
        if(!span.textContent)
          span.textContent = id
        return span
      }
    }
  }
}

