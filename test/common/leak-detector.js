// Generated by CoffeeScript 1.3.3
(function() {
  var detector;

  detector = function() {
    var _detector;
    _detector = require('gleak')();
    _detector.detectNew();
    _detector.lookForLeaks = function(test) {
      var leaks;
      leaks = _detector.detectNew();
      leaks.forEach(function(name) {
        return console.warn('found global leak: %s', name);
      });
      leaks.should.have.length(0, 'leak detected');
      return test.done();
    };
    return _detector;
  };

  module.exports = detector;

}).call(this);
