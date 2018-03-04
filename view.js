var isFeed = require('ssb-ref').isFeed
var h = require('hyperscript')


exports.gives = {
  app: { view: true }
}

exports.needs = {
  avatar: {
    name: 'first',
    image: 'first',
    action: 'map',
  },
  sbot: {
    friends: { get: 'first' }
  },
  identity: {
    main: 'first'
  }
}

exports.create = function (api) {
  document.head.appendChild(h('style', {textContent:
    '.avatar__relation img { width: 32px; height: 32px; }\n' +
    '.avatar__relation { display: flex; flex-wrap: wrap; }'
  }))
  return { app: { view: function (id) {

    if(!isFeed(id)) return

    var friends = h('div.avatar__relation')
    var follows = h('div.avatar__relation')
    var followers = h('div.avatar__relation')

    function image (id) {
      var img = h('img')
      api.avatar.image(id, function (src) { img.src = src })
      return img
    }

    function append (el, id) {
      el.appendChild(h('a', {href: id}, image(id)))
    }

    //categories:
    //friends, follows, followers
    //mutual friends, friends that you follow, friends that follow you, other friends
    var data = {followers: null, follows: null}
    api.sbot.friends.get({source: id}, function (err, follows) {
      data.follows = follows
      if(data.follows && data.followers) next()
    })

    api.sbot.friends.get({dest: id}, function (err, followers) {
      data.followers = followers
      if(data.follows && data.followers) next()
    })

    function next () {
      for(var k in data.follows) {
        append(data.followers[k] ? friends : follows, k)
      }
      for(var k in data.followers)
        if(!data.follows[k]) append(followers, k)
    }


    return h('div.Avatar__view',
      h('div.Avatar__header',
        h('h1', api.identity.main() == id ? 'you are: ' : 'this is: ', api.avatar.name(id)), image(id)
      ),
      //actions: follow, etc
      h('div.Avatar__actions', api.avatar.action(id)),
      h('div.friends',
        h('h2', 'Friends'),
        friends
      ),
      h('div.followers',
        h('h2', 'Followers'),
        followers
      ),
      h('div.follows',
        h('h2', 'Follows'),
        follows
      )
    )

  }}}
}




