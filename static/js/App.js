define(["jquery-ui", "backbone", "todo/Todos", "todo/TodoView"], function($, Backbone, Todos, TodoView){
  var App = Backbone.View.extend({
    el: $("#todoapp"),
    
    events: {
      "click #todo-new-button":  "create",
      "keypress #todo-new-input": "edit_keypress"
    },
    
    initialize: function() {
      this.listenTo(Todos.instance(), 'add', this.add);
      
      this.input = this.$("#todo-new-input");
      
      $( "#todo-list" ).sortable({
        handle: ".button-move",
        stop: function(e, ui) {
          var todoview = $(ui.item).data("todoview"); // get the view from the dom element, previously stored
          var from = todoview.model.get("order");
          var to = ui.item.index();
          
          Todos.instance().reindex(from, to); // re create order values for every affected model
        }
      });
      
      Todos.instance().fetch();
    },
    
    edit_keypress: function(e) {
      // on "enter" add new item
      if (e.keyCode == 13) {
        this.create();
      }
    },
    
    create: function(){
      Todos.instance().create({title: this.input.val(), order: Todos.instance().length});
      this.input.val('');
    },
    
    add: function(todo) {
      var view = new TodoView({model: todo, order: Todos.instance().length});
      this.$("#todo-list").append(view.render().el);
    }
  });
  return App;
});
