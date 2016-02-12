# Credits to "The Little Book on CoffeeScript"
# @ https://arcturo.github.io/library/coffeescript/03_classes.html

moduleKeywords = ['extended', 'included']

class ClassHelper

  @extend: (obj) ->
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    obj.extended?.apply(@)
    this

  @include: (obj) ->
    for key, value of obj when key not in moduleKeywords
      @::[key] = value

    obj.included?.apply(@)
    this
	
	
module.exports = ClassHelper