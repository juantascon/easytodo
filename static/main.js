require.config({
  
  //urlArgs: "bust=" + (new Date()).getTime(),
  
  paths: {
    "jquery": "lib/jquery",
    "jquery-ui": "lib/jquery-ui",
    "underscore": "lib/underscore",
    "backbone": "lib/backbone",
    "todo/Todo": "js/todo/Todo",
    "todo/Todos": "js/todo/Todos",
    "todo/TodoView": "js/todo/TodoView",
    "StatsView": "js/StatsView",
    "App": "js/App"
  },
  
  shim: {
    "jquery": { exports: "$" },
    "jquery-ui": { exports: "$", deps: ["jquery"] },
    "underscore": { exports: "_" },
    "backbone": { exports: "Backbone", deps: ["underscore", "jquery"] }
  }
});

require([ "App" ], function(App){
  new App;
});
