define([ "jquery", "underscore", "backbone", "todo/Todos" ], function($, _, Backbone, Todos) {
  var StatsView = Backbone.View.extend({
    el: $("#stats"),
    
    template: _.template($('#template-stats').html()),
    
    events: {
      "click a.button-mark-all-complete":  "mark_all_complete"
    },
    
    initialize: function() {
      this.listenTo(Todos.instance(), 'all', this.render);
      this.render();
    },
    
    render: function() {
      this.$("#todo-count").html(this.template({remaining: Todos.instance().count_remaining()}));
      return this;
    },
    
    mark_all_complete: function(){
      Todos.instance().mark_all_complete();
    }
  });
  
  return StatsView;
});
