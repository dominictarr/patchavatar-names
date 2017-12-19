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

exports.create = function (api) {
  var friends, names, wait = []
  return {
    avatar: {
      image: function (id) {
        var img = document.createElement('img')
        img.title = id
        api.sbot.names.getImageFor(id, function (err, blob) {
          if(!ref.isBlob(blob)) return
          img.src = 'http://localhost:8989/blobs/get/'+blob
        })
        return img
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



