
var restate = require('../../src/server.js');
var Regular = require('regularjs');
var expect = require('../runner/vendor/expect.js');


describe("Simple Test", function(){

  var manager = restate(require('./util/routeConfig.js').blog)

  it("check Server render result ", function( done){

    manager.run('/blog/1/detail?rid=3').then(function(arg){
      expect(arg.html.replace(/\s*\>\s*\</g, '><')).to.equal('<div><div><h2 class="hook">Hello Blog</h2><div><div>Blog Content Here</div></div></div></div>')
      expect(arg.data).to.eql({
        "app": undefined,
        "app.blog": {
          title: 'Hello Blog'
        },
        "app.blog.detail": {
          content: 'Blog Content Here'
        }
      })
      done();
    }).catch(function(err){
      console.log(err)
      throw err
    })
  })
  it("behavior purpose here", function( done){


    expect(1).to.not.be.equal(2);
    done()
  })
})