(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['stateman'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('stateman'));
    } else {
        // Browser globals (root is window)
        root.restate = factory(root.StateMan);
    }
}(this, function (StateMan) {

  var _ = StateMan.util;

  var restate = function(option){
    option = option || {};
    var stateman = option.stateman || new StateMan(option);
    var preStae = stateman.state;
    var BaseComponent = option.Component;
    var globalView = option.view || document.body;

    var filters = {
      encode: function(value, param){
        return stateman.history.prefix + (stateman.encode(value, param || {}) || "");
      }
    }

    stateman.state = function(name, Component, config){
      if(typeof config === 'undefined') config = {};

      if(!Component) return preStae.call(stateman, name);

      if(BaseComponent){
        // 1. regular template or parsed ast
        if(typeof Component === "string" || Array.isArray( Component )){
          Component = BaseComponent.extend({
            template: Component
          })
        }
        // 2. it a Object, but need regularifi
        if(typeof Component === "object" && Component.regularify ){
          Component = BaseComponent.extend( Component );
        }
      }

      // 3. duck check is a Regular Component
      if( Component.extend && Component.__after__ ){

        if(!Component.filter("encode")){
          Component.filter(filters);
        }
        var state = {
          component: null,
          enter: function( step ){
            var data = { $param: step.param },
              component = this.component,
              // if component is not exsit or need autoreset
              noComponent = !component || config.autoreset, 
              view;

            if(noComponent){
              component = this.component = new Component({
                data: data,
                $state: stateman
              });

            }
            _.extend(component.data, data, true);

            var parent = this.parent, view;
            if(parent.component){
              var view = parent.component.$refs.view;
              if(!view) throw this.parent.name + " should have a element with [ref=view]";
            }
            component.$inject( view || globalView )
            var result = component.enter && component.enter(step);
            component.$mute(false);
            if(noComponent) component.$update();
            return result;
          },
          leave: function( option){
            var component = this.component;
            if(!component) return;

            if( config.autoreset) component.destroy();
            component.$inject(false);
            component.leave && component.leave(option);
            component.$mute(true);
          },
          update: function(option){
            var component = this.component;
            if(!component) return;
            component.update && component.update(option);
            component.$update({
              $param: option.param
            })
            component.$emit("state:update", option);
          }
        }

        if(typeof config === "string") config = {url: config};
        _.extend(state, config || {});

        preStae.call(stateman, name, state);

      }else{
        preStae.call(stateman, name, Component);
      }
      return this;
    }
    return stateman;
  }

  restate.StateMan = StateMan;

  return restate;

}));
