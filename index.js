/**
 * @Author Adam Griffiths
 * @description [Node water](https://github.com/aogriffiths/node-wtr) to
 *              grow your node.js project with less effort.
 *              On [github.com](https://github.com/aogriffiths/node-wtr-lazy-functions)
 *              On [npmjs.org](https://npmjs.org/package/lazy-functions)
 * 
 * Credits: John Resig - http://ejohn.org/blog/partial-functions-in-javascript/
 * Caolan McMahon - https://github.com/caolan/async
 */

//TEST


var _ = require("underscore");
var async = require("async");

//for convienience so users of lazy can have quick access to async too.
exports.async = async;

var keywords = {}; //used for in addition to exporting for some keyword like functions

var logger = {
  debug : function() {
  }
}

var setlogger = exports.setlogger = function(newlogger) {
  logger = newlogger;
  logger.debug('logger set');
}

var __DEBUG__ = false;

var FunctionSpec = exports.FunctionSpec = function(func) {
  if (!(this instanceof FunctionSpec)) {
    return new FunctionSpec(func);
  }
  ;
  // console.log(func);
  this.func = func;
  return this;
}

//START Keywords ////////////////////////////////////////////////
//Call 
var Call = keywords.Call = exports.Call = function(func) {
  if (!(func instanceof FunctionSpec)) {
    func = new FunctionSpec(func);
  }
  return func;
}

//Then 
var Then = keywords.Then = exports.Then = function(func) {
  if (!(func instanceof FunctionSpec)) {
    func = new FunctionSpec(func);
  }
  func.Then = true;
  return func;
}

//Call 
var Push = keywords.Push = exports.Push = function(data) {
  var func = function(callback){
    callback(null, data);
  }
  func = new FunctionSpec(func);
  return func;
}

//Finally 
var Finally = keywords.Finally = exports.Finally = function(func) {
  if (!(func instanceof FunctionSpec)) {
    func = new FunctionSpec(func);
  }
  func.Finally = true;
  return func;
}
//END Keywords ////////////////////////////////////////////////


FunctionSpec.prototype.withargs = function() {
  if(!this.args) this.args = [];
  this.args = this.args.concat(Array.prototype.slice.call(arguments));
  return this;
}

FunctionSpec.prototype.resultin = FunctionSpec.prototype.into = function(result) {
  this.result = result;
  return this;
}

/*
var river = exports.river = function(funcspecs, callback) {
}
*/

var river = exports.river = function(funcspecs, finalcallback) {
  if (!Array.isArray(funcspecs)) {
    funcspecs = Array.prototype.slice.call(arguments);
    finalcallback = undefined;
  }
  var context = {};
  var tasks = comipleforasyncauto(funcspecs, context);
  
  //Try to find a function marked as Finally
  finalcallback = finalcallback || getFinalCallback(funcspecs);
  //console.log('finalcallback', finalcallback);
  
  asynccallback = function(err, data){
    if(finalcallback){
      finalcallback(err, context);
    }
  }
  async.auto(tasks, asynccallback);
}

var getFinalCallback = exports.getFinalCallback = function(funcspecs){
  var found = undefined;
  funcspecs.forEach(function(funcspec){
    if(funcspec.Finally) {
      found = funcspec.func;
    }
  });
  return found;
}

var comipleforasyncauto = exports.comipleforasyncauto = function(funcspecs, context) {
  var autoinput = {}
  var resultstosteps = {}
  var step = 0;
  funcspecs.forEach(function(funcspec) {
    if(! funcspec.Finally){ //Finally functions are handled separately
      funcspec.func = funcspec.func || funcspec;
      step++;
      if (funcspec.result) {
        if (!resultstosteps[funcspec.result]) {
          resultstosteps[funcspec.result] = [];
        }
        resultstosteps[funcspec.result].push(step);
      }
      var todo = [];
      todo.push(wrapFnForAsyncAuto(funcspec.func, funcspec.args, funcspec.result || '_' + step, context));
      if (funcspec.args) {
        funcspec.args.forEach(function(arg) {
          var steps = resultstosteps[arg];
          steps.forEach(function(step) {
            todo.unshift(step);
          })
        })
      }
      if(funcspec.Then){
        todo.unshift(step - 1);
      }
      autoinput[step] = todo;
    }
  })
  return autoinput;
}

function contextKeeper(result, context, callback) {
  return function(err, data) {
    if (result) {
      context[result] = data;
    }
    callback(err, data);
  }
}

function wrapFnForAsyncAuto(func, args, result, context) {
  return function(callback, results) {
    newargs = [];
    if (args) {
      args.forEach(function(arg) {
        newargs.push(context[arg]);
      })
    }
    newargs.push(contextKeeper(result, context, callback));
    func.apply(null, newargs);
  }
}

var pullkeywordsinto = exports.pullkeywordsinto = function(obj){
  for (var key in keywords)
    global[key] = keywords[key]
}
