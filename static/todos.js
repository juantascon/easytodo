$(function(){
  
  var TodoModel = Backbone.Model.extend({
    defaults: function() {
      return { title: "edit me!", done: false, id: uuid() };
    },
    
    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });
  
  var TodoView = Backbone.View.extend({
    tagName:  "li",
    
    template: _.template($('#template-items').html()),
    
    events: {
      "click .toggle" : "toggle",
      "click a.button-destroy" : "destroy",
      "click a.button-edit" : "edit_start",
      "blur .edit": "edit_end", //"blur .edit" means focus leaves the edit input field
      "keypress .edit": "edit_keypress"
    },
    
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
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
    
    url: "/api/todos",
    //localStorage: new Backbone.LocalStorage("todos-backbone"),
    
    filter_done: function() {
      return this.where({done: true});
    },
    
    filter_remaining: function() {
      return this.where({done: false});
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
      
      todos.fetch();
    },
    
    edit_keypress: function(e) {
      // on "enter" add new item
      if (e.keyCode == 13) {
        this.create();
      }
    },
    
    create: function(){
      todos.create({title: this.input.val()});
      this.input.val('');
    },
    
    add: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },
    
    add_all: function() {
      todos.each(this.add, this);
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
      
      todos.fetch();
    },
    
    edit_keypress: function(e) {
      // on "enter" add new item
      if (e.keyCode == 13) {
        this.create();
      }
    },
    
    create: function(){
      todos.create({title: this.input.val()});
      this.input.val('');
    },
    
    add: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },
    
    add_all: function() {
      todos.each(this.add, this);
    }
  });
  
  var todos = new TodoList;
  var app = new AppView;

});
