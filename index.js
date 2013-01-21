/**
 * @Author Adam Griffiths
 * @description [Node water](https://github.com/aogriffiths/node-wtr) to grow your node.js project with less effort. 
 * 
 * Credits:
 * John Resig - http://ejohn.org/blog/partial-functions-in-javascript/
 * Caolan McMahon - https://github.com/caolan/async
 */

var _              = require("underscore");
var async          = require("async");

var logger = {
    debug: function(){}
}

var setlogger = exports.setlogger = function(newlogger){
  logger = newlogger;
  logger.debug('logger set');
}

var __DEBUG__ = false;

var FunctionSpec = exports.FunctionSpec = function(func){
  if (!(this instanceof FunctionSpec)){
    return new FunctionSpec(func);
  };
  //console.log(func);
  this.func = func;
  return this;
}

//Call is synonymous with FunctionSpec
var Call = exports.Call = FunctionSpec;

FunctionSpec.prototype.withargs = function(){
  this.args = Array.prototype.slice.call(arguments);
  return this;
}

FunctionSpec.prototype.resultin = function(result){
  this.result = result;
  return this;
}

var river = exports.river = function(funcspecs, callback){
}
  
var run = exports.run = function(funcspecs, callback){
  if(!Array.isArray(funcspecs )){
    funcspecs = Array.prototype.slice.call(arguments);
    callback = funcspecs.pop();
  }
  var context = {};  
  var tasks = comipleforasyncauto(funcspecs, context);
  async.auto(tasks, function(err, data){
    callback(err, context);
  });
}


var comipleforasyncauto = exports.comipleforasyncauto = function(funcspecs, context){
  var autoinput = {}
  var resultstosteps = {}
  var step = 0;
  funcspecs.forEach(function(funcspec){
    funcspec.func =  funcspec.func || funcspec;
    step++;
    if(funcspec.result){
      if(! resultstosteps[funcspec.result]){
        resultstosteps[funcspec.result] = [];
      }
      resultstosteps[funcspec.result].push(step);
    }
    var todo = [];
    todo.push(wrapFnForAsyncAuto(funcspec.func, funcspec.args, funcspec.result || '_' + step, context));
    if(funcspec.args){
      funcspec.args.forEach(function(arg){
        var steps =  resultstosteps[arg];
        steps.forEach(function(step){
          todo.unshift(step); 
        })
      })
    }
    autoinput[step] = todo;
  })
  return autoinput;
}

function contextKeeper(result, context, callback){
  return function(err, data){
    if(result){
      context[result] = data;
    }
    callback(err, data);
  }
}

function wrapFnForAsyncAuto(func, args, result, context){
  return function(callback, results){
    newargs = [];
    if(args){
      args.forEach(function(arg){
        newargs.push(context[arg]);
      })
    }
    newargs.push(contextKeeper(result, context, callback));
    func.apply(null,newargs);
  }
}