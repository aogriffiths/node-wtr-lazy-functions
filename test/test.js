var lazy = require('../index');
lazy.pullkeywordsinto(global);

var assert = require('assert');
var __DEBUG__ = false;
var tests = {};

tests.river1 = function(){
  //MDEG_EXAMPLE_START #test1
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
  //MDEG_EXAMPLE_END
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
    Finally(function(err, data) {
      assert.equal(data._1, 8);
      assert.equal(data._2, 11);
      assert.equal(err, null);
    })
  );
}

var fn_5 = function(callback){
  callback(null,5);
}
var fn_11 = function(callback){
  callback(null,11);
}
var fn_wrapup = function(err, data){
  assert.equal(data._1, 5);
  assert.equal(data._2, 11);
  assert.equal(err, null);
}

tests.river7a = function() {
  lazy.river(
    Call(fn_5),
    Call(fn_11),
    Finally(fn_wrapup)
  )
}

tests.river7b = function() {
  lazy.river(
    Call(fn_5),
    Then(fn_11),
    Finally(fn_wrapup)
  )
}

var test8a_inc = 1;

var fn_8a_5 = function(callback){
  //console.log('fn_8a_5 called');  
  setTimeout(function(){
    //console.log('fn_8a_5 calling back');
    callback(null,test8a_inc++)
  },1000);
}
var fn_8a_11 = function(callback){
  //console.log('fn_8a_11 called');
  callback(null,test8a_inc++);
}
var fn_8a_wrapup = function(err, data){
  assert.equal(data._1, 2); //expect func 1 to return after func 2 because of the  setTimeout;
  assert.equal(data._2, 1); 
  assert.equal(err, null);
}

tests.river8a = function() {
  lazy.river(
    Call(fn_8a_5),
    Call(fn_8a_11),
    Finally(fn_8a_wrapup)
  )
}


var test8b_inc = 1;

var fn_8b_5 = function(callback){
  //console.log('fn_8b_5 called');  
  setTimeout(function(){
    //console.log('fn_8b_5 calling back');
    callback(null,test8b_inc++)
  },1000);
}
var fn_8b_11 = function(callback){
  //console.log('fn_8b_11 called');
  callback(null,test8b_inc++);
}
var fn_8b_wrapup = function(err, data){
  assert.equal(data._1, 1); //expect func 2 to return after func 1 because of the Then keyword;
  assert.equal(data._2, 2); 
  assert.equal(err, null);
}

tests.river8b = function() {
  lazy.river(
    Call(fn_8b_5),
    Then(fn_8b_11),
    Finally(fn_8b_wrapup)
  )
}


for ( var test in tests) {
  console.log('Running ' + test);
  tests[test]();
}