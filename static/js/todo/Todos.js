define(["backbone", "todo/Todo"], function(Backbone, Todo) {
  var Todos = Backbone.Collection.extend({
    
    model: Todo,
    comparator: "order",
    url: "/api/todos",
    //localStorage: new Backbone.LocalStorage("todos-backbone"),
    
    count_done: function() {
      return this.where({done: true}).length;
    },
    
    count_remaining: function() {
      return this.where({done: false}).length;
    },
    
    mark_all_complete: function() {
      this.each(function(model){
        model.save({done: true});
      });
    },
    
    reindex: function(from, to) {
      if (from == to) { return; }
      
      this.at(from).save({order: to});
      
      if( from > to ) {
        for (var i = to; i < from; i++) {
          this.at(i).save({order: i+1});
        }
      }
      else {
        for (var i = from+1; i < to+1; i++) {
          this.at(i).save({order: i-1});
        }
      }
      
      this.sort(); //resort the items based on the comparator
    }
  },
  {
    _instance: null,
    instance: function(){
      if (! Todos._instance){
        Todos._instance = new Todos;
      }
      return Todos._instance;
    }
  });
  
  return Todos;
});
