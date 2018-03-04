
module.exports = function (src, fn) {
  //doing it this way will only update the avatar if
  //this image successfully loads. unselected avatars
  //will remain on the raw fallback.
  var img = document.createElement('img')
  img.src = src
  img.onload = function () {
    fn(src)
  }

}

