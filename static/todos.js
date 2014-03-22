$(function(){
  
  var TodoModel = Backbone.Model.extend({
    defaults: function() {
      return { title: "edit me!", done: false, id: uuid(), order: 0 };
    },
    
    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });
  
  var TodoView = Backbone.View.extend({
    tagName:  "li",
    
    template: _.template($('#template-item').html()),
    
    events: {
      "click .toggle" : "toggle",
      "click a.button-destroy" : "destroy",
      "click a.button-move" : "destroy",
      "dblclick .view" : "edit_start",
      "blur .edit": "edit_end", //"blur .edit" means focus leaves the edit input field
      "keypress .edit": "edit_keypress"
    },
    
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      $(this.el).data("todoview", this); // assign the view to the dom element
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },
    
    toggle: function(){
      this.model.toggle();
    },
    
    destroy: function(){
      this.model.destroy();
    },
    
    edit_start: function(){
      this.$el.addClass("editing");
      this.input.focus();
    },
    
    edit_end: function(){
      var value = this.input.val();
      this.model.save({title: value});
      this.$el.removeClass("editing");
    },
    
    edit_keypress: function(e){
      // on "enter" close editing
      if (e.keyCode == 13) {
        this.edit_end();
      }
    }
  });
  
  var TodoList = Backbone.Collection.extend({
    model: TodoModel,
    
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
      console.log("from:"+from);
      console.log("to:"+to);
      
      if (from == to) { return; }
      
      console.log(""+from+"->"+(to));
      this.at(from).save({order: to});
      
      if( from > to ) {
        for (var i = to; i < from; i++) {
          console.log(""+i+"->"+(i+1));
          this.at(i).save({order: i+1});
        }
      }
      else {
        for (var i = from+1; i < to+1; i++) {
          console.log(""+i+"->"+(i-1));
          this.at(i).save({order: i-1});
        }
      }
      
      this.sort(); //resort the items based on the comparator
    }
  });
  
  var AppView = Backbone.View.extend({
    el: $("#todoapp"),
    
    events: {
      "click #todo-new-button":  "create",
      "keypress #todo-new-input": "edit_keypress"
    },
    
    initialize: function() {
      this.listenTo(todos, 'add', this.add);
      
      this.input = this.$("#todo-new-input");
      
      $( "#todo-list" ).sortable({
        handle: ".button-move",
        stop: function(e, ui) {
          var todoview = $(ui.item).data("todoview"); // get the view from the dom element, previously stored
          var from = todoview.model.get("order");
          var to = ui.item.index();
          
          todos.reindex(from, to); // re create order values for every affected model
        }
      });
      
      todos.fetch();
    },
    
    edit_keypress: function(e) {
      // on "enter" add new item
      if (e.keyCode == 13) {
        this.create();
      }
    },
    
    create: function(){
      todos.create({title: this.input.val(), order: todos.length});
      this.input.val('');
    },
    
    add: function(todo) {
      var view = new TodoView({model: todo, order: todos.length});
      this.$("#todo-list").append(view.render().el);
    }
  });
  
  // handles count text and mark-all button
  var StatsView = Backbone.View.extend({
    el: $("#stats"),
    
    template: _.template($('#template-stats').html()),
    
    events: {
      "click a.button-mark-all-complete":  "mark_all_complete"
    },
    
    initialize: function() {
      this.listenTo(todos, 'all', this.render);
      this.render();
    },
    
    render: function() {
      this.$("#todo-count").html(this.template({remaining: todos.count_remaining()}));
      return this;
    },
    
    mark_all_complete: function(){
      todos.mark_all_complete();
    }
  });
  
  var todos = new TodoList;
  var app = new AppView;
  var stats = new StatsView;

});
