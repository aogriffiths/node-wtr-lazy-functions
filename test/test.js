var lazy = require('../index');
var assert = require('assert');
var __DEBUG__ = false;
var tests = {};

tests.river1 = function(){
  var fn = function(callback){
    callback(null,1);
  }
  lazy.river([
      {func:fn, result:'a'},
      {func:fn, result:'b'}
  ],
  function(err, data){
    assert.equal(data.a, 1);
    assert.equal(data.b, 1);
    assert.equal(err,null);
  });
}

tests.river2 = function(){
  var i = 3;
  var fn = function(callback){
    callback(null,i++);
  }
  lazy.river([
      {func:fn, result:'a'},
      {func:fn, result:'b'}
  ],
  function(err, data){
    assert.equal(data.a, 3);
    assert.equal(data.b, 4);
    assert.equal(err,null);
  });
}

tests.river3a = function(){
  var fn1 = function(callback){
    callback(null,5);
  }
  var fn2 = function(a, callback){
    callback(null,a+2);
  }
  lazy.river([
      {func:fn1, result:'a'},
      {func:fn2, result:'b', args:['a']}
  ],
  function(err, data){
    assert.equal(data.a, 5);
    assert.equal(data.b, 7);
    assert.equal(err,null);
  });
}

var Call = lazy.Call;

tests.river3b = function(){
  var fn1 = function(callback){
    callback(null,5);
  }
  var fn2 = function(a, callback){
    callback(null,a+2);
  }
  lazy.river([
    Call(fn1).resultin('a'),
    Call(fn2).resultin('b').withargs('a')
  ],
  function(err, data){
    assert.equal(data.a, 5);
    assert.equal(data.b, 7);
    assert.equal(err,null);
  });
}



tests.river4 = function(){
  var fn1 = function(callback){
    callback(null,5);
  }
  var fn2 = function(a, callback){
    callback(null,a+2);
  }
  lazy.river([
      {func:fn1, result:'a'},
      {func:fn2, result:'b', args:['a']}
  ],
  function(err, data){
    assert.equal(data.a, 5);
    assert.equal(data.b, 7);
    assert.equal(err,null);
  });
}

tests.river5 = function() {
  lazy.river([ 
  function(callback) {
    callback(null, 5);
  },
  function(callback) {
    callback(null, 9);
  } ], 
  function(err, data) {
    assert.equal(data._1, 5);
    assert.equal(data._2, 9);
    assert.equal(err, null);
  });
}

tests.river6 = function() {
  lazy.river(
    function(callback) {
      callback(null, 8);
    }, 
    function(callback) {
      callback(null, 11);
    }, 
    function(err, data) {
      assert.equal(data._1, 8);
      assert.equal(data._2, 11);
      assert.equal(err, null);
    }
  );
}

for ( var test in tests) {
  console.log('Running ' + test);
  tests[test]();
}