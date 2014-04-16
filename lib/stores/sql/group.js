var Utils = require('../../utils');
var Helper = require('./helper');

/*
 * MODEL
 */
exports.model = {
  
  /**
   * Specify SQL group fields.
   * @section Model
   * @method group
   * @param {array} fields - The field names
   *
   *
   * @return {Model}
   */
  group: function(){
    var self = this.chain();

    var args = Utils.args(arguments);
    var fields = []
    fields = fields.concat.apply(fields, args); //flatten
    
    self.addInternal('group', fields);    
    
    return self;
  },
  
  
  /**
   * SQL Having conditions
   * @section Model/Find
   * @method having
   * @param {object} conditions - every key-value pair will be translated into a condition
   * or
   * @param {array} conditions - The first element must be a condition string with optional placeholder (?), the following params will replace this placeholders
   *
   * @return {Model}
   */
  having: function(){
    var self = this.chain();
    var args = Utils.args(arguments);
         
    var conditions = Helper.sanitizeCondition(this, args);
    
    self.addInternal('having', conditions);
            
    return self;
  }
};


/*
 * DEFINITION
 */
exports.definition = {
  mixinCallback: function(){
    var self = this;  

    this.beforeFind(function(query){
      var group = this.getInternal('group');
      var select = this.getInternal('select');  
      var having = this.getInternal('having');
      var table_map = this.getInternal('table_map');
                  
      if(group){
        if(!select){
          this.select(group);
        }        
        
        query.groupBy.apply(query, group);
                
        if(having){
          Helper.applyConditions(having, table_map, query, true);
        }
                
        this.asJson();
      }
         
      return true;
    }, -45);        
  }
};