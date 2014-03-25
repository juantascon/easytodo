define([ "backbone" ], function(Backbone) {
  var Todo = Backbone.Model.extend({
    
    defaults: function() {
      return { title: "edit me!", done: false, id: this.random_uuid(), order: 0 };
    },
    
    toggle: function() {
      this.save({done: !this.get("done")});
    },
    
    random_uuid: function() {
      var _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0
        var v = c=='x' ? r : r&0x3|0x8;
        return v.toString(16);
      });
      
      return _uuid;
    }
    
  });
  
  return Todo;
});
