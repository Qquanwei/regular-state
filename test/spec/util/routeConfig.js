var Regular = require('regularjs');
module.exports = {
  "blog": {
    routes: {
      "login": {
        view: Regular.extend({
          template: '<div class="m-login"></div>'
        })
      },
      'app': {
        url: '',
        view: Regular.extend({
          template: '<div r-view ></div>'
        })
      },
      'app.index': {
        view: Regular.extend({
          template: 
            '<div>\
              <h2 class="index">{title}</h2>\
              <div r-view ></div>\
            </div>'
        }),
        data: function(option, resolve){
          resolve({
            title: 'Hello Index'
          })
        }

      },
      'app.blog': {
        view: Regular.extend({
          template: 
            '<div>\
              <h2 class="hook">{title}</h2>\
              <div r-view ></div>\
            </div>' ,
            enter: function(){
              this.data.title='修改后的title'
            }
        }),
        data: function(){
          return {
            title: 'Hello Blog',
          }
        }
      },
      'app.blog.detail': {
        url: ':id/detail',
        view: Regular.extend({
          template: 
            '<div class="detail">{content}</div>'
        }),
        data: function(option){
          var param = option.param;
          return {
            content: 'Blog Content Here'+param.rid
          }
        }
      },
      'app.lazyload': {
        view: function(option){
          return new Promise(function(resolve){
            setTimeout(function(){
              resolve(
                Regular.extend({
                  template: "<div class='lazyload'>LazyLoad</div>"
                })
              )
            }, 100)
          })
        }
      },
      "app.onlybrowser": {
        ssr: false,
        view: Regular.extend({
          template: "<div class='onlybrowser'>onlybrowser</div>"
        })
      }
    }
  }
}