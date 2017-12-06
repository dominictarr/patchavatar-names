exports.needs = {
  sbot: {
    friends: { get: 'first' },
    names: { getSignifier: 'first'}
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
      image: function () { }, //fall through...
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







