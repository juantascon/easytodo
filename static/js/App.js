define(["jquery-ui", "backbone", "todo/Todos", "todo/TodoView", "StatsView"],
       function($, Backbone, Todos, TodoView, StatsView) {
        
  var App = Backbone.View.extend({
    el: $("#todoapp"),
    
    events: {
      "click #todo-new-button":  "add_model",
      "keypress #todo-new-input": "edit_keypress"
    },
    
    initialize: function() {
      // create a view for every new todo model
      this.listenTo(Todos.instance(), 'add', this.add_view);
      
      this.statsview = new StatsView;
      
      this.input = this.$("#todo-new-input");
      
      // adds drag-and-drop functionality to the list
      $( "#todo-list" ).sortable({
        handle: ".button-move",
        stop: function(e, ui) {
          var todoview = $(ui.item).data("todoview"); // get the view from the dom element, previously stored
          var from = todoview.model.get("order"); // original position
          var to = ui.item.index(); // future position
          
          Todos.instance().reindex(from, to); // re create order values for every affected model
        }
      });
      
      // 
      Todos.instance().fetch();
    },
    
    edit_keypress: function(e) {
      // on "enter" add new todo
      if (e.keyCode == 13) {
        this.add_model();
      }
    },
    
    // create a new todo from the input's text
    add_model: function(){
      Todos.instance().create({title: this.input.val(), order: Todos.instance().length});
      this.input.val('');
    },
    
    // create a new view from a model
    add_view: function(todo) {
      var view = new TodoView({model: todo, order: Todos.instance().length});
      this.$("#todo-list").append(view.render().el);
    }
  });
  return App;
});
