define([ "jquery", "underscore", "backbone", "todo/Todo" ], function($, _, Backbone, Todo) {
  var TodoView = Backbone.View.extend({
    tagName:  "li",
    template: _.template($('#template-item').html()),
    
    events: {
      "click .toggle" : "toggle",
      "click a.button-destroy" : "destroy",
      "dblclick .view" : "edit_start",
      "blur .edit": "edit_end", //"blur .edit" means focus leaves the edit input field
      "keypress .edit": "edit_keypress"
    },
    
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      $(this.el).data("todoview", this); // assign this view to the dom element, for future event handling
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
  
  return TodoView;
});
