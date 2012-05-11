// Generated by CoffeeScript 1.3.1
(function() {
  var CoffeeScript, app, async, elementByCss, evalShouldEqual, executeCoffee, express, runTestWith, should, textShouldEqual, valueShouldEqual, wd;

  wd = require('../../lib/main');

  should = require('should');

  express = require('express');

  CoffeeScript = require('coffee-script');

  async = require('async');

  evalShouldEqual = function(browser, formula, expected) {
    return function(done) {
      return browser["eval"](formula, function(err, res) {
        should.not.exist(err);
        res.should.equal(expected);
        return done(null);
      });
    };
  };

  executeCoffee = function(browser, script) {
    var scriptAsJs;
    scriptAsJs = CoffeeScript.compile(script, {
      bare: 'on'
    });
    return function(done) {
      return browser.execute(scriptAsJs, function(err) {
        should.not.exist(err);
        return done(null);
      });
    };
  };

  elementByCss = function(browser, env, css, name) {
    return function(done) {
      return browser.elementByCss(css, function(err, res) {
        should.not.exist(err);
        env[name] = res;
        return done(null);
      });
    };
  };

  textShouldEqual = function(browser, element, expected, done) {
    return browser.text(element, function(err, res) {
      should.not.exist(err);
      res.should.equal(expected);
      return done(null);
    });
  };

  valueShouldEqual = function(browser, element, expected, done) {
    return browser.getValue(element, function(err, res) {
      should.not.exist(err);
      res.should.equal(expected);
      return done(null);
    });
  };

  runTestWith = function(remoteWdConfig, desired) {
    var browser;
    browser = null;
    return {
      "wd.remote": function(test) {
        browser = wd.remote(remoteWdConfig);
        browser.on("status", function(info) {
          return console.log("\u001b[36m%s\u001b[0m", info);
        });
        browser.on("command", function(meth, path) {
          return console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
        });
        return test.done();
      },
      "status": function(test) {
        return browser.status(function(err, status) {
          should.not.exist(err);
          should.exist(status);
          return test.done();
        });
      },
      "sessions": function(test) {
        return browser.sessions(function(err, sessions) {
          should.not.exist(err);
          should.exist(sessions);
          return test.done();
        });
      },
      "init": function(test) {
        return browser.init(desired, function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "sessionCapabilities": function(test) {
        return browser.sessionCapabilities(function(err, capabilities) {
          should.not.exist(err);
          should.exist(capabilities);
          should.exist(capabilities.browserName);
          should.exist(capabilities.platform);
          return test.done();
        });
      },
      "altSessionCapabilities": function(test) {
        return browser.altSessionCapabilities(function(err, capabilities) {
          should.not.exist(err);
          should.exist(capabilities);
          should.exist(capabilities.browserName);
          should.exist(capabilities.platform);
          return test.done();
        });
      },
      "setPageLoadTimeout": function(test) {
        return browser.setPageLoadTimeout(500, function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "get": function(test) {
        return browser.get("http://127.0.0.1:8181/test-page.html", function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      /*
          "refresh": (test) ->
            browser.refresh (err) ->
              should.not.exist err
              test.done()
      
          "back / forward": (test) ->
            async.series [
              (done) ->
                browser.get "http://127.0.0.1:8181/test-page.html?p=2", (err) ->
                  should.not.exist err
                  done null
              (done) ->
                browser.url (err, url) ->
                  should.not.exist err            
                  url.should.include "?p=2"
                  done null
              (done) ->
                browser.back  (err) ->
                  should.not.exist err
                  done null
              (done) ->
                browser.url (err, url) ->
                  should.not.exist err            
                  url.should.not.include "?p=2"
                  done null
              (done) ->
                browser.forward  (err) ->
                  should.not.exist err
                  done null
              (done) ->
                browser.url (err, url) ->
                  should.not.exist err            
                  url.should.include "?p=2"
                  done null
              (done) ->
                browser.get "http://127.0.0.1:8181/test-page.html", (err) ->
                  should.not.exist err
                  done null
            ], (err) ->
              should.not.exist err
              test.done()
          
          "eval": (test) ->
            async.series [
              evalShouldEqual browser, "1+2", 3
              evalShouldEqual browser, "document.title", "TEST PAGE"
              evalShouldEqual browser, "$('#eval').length", 1
              evalShouldEqual browser, "$('#eval li').length", 2        
            ], (err) ->
              should.not.exist err
              test.done()
      
          "execute": (test) ->
            async.series [
              (done) ->  browser.execute "window.wd_sync_execute_test = 'It worked!'", (err) ->
                should.not.exist err
                done(null)      
              evalShouldEqual browser, "window.wd_sync_execute_test", 'It worked!'             
            ], (err) ->
              should.not.exist err
              test.done()        
      
          "executeAsync": (test) ->
            scriptAsCoffee =
              """
                [args...,done] = arguments
                done "OK"              
              """
            scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'      
            browser.executeAsync scriptAsJs, (err,res) ->          
              should.not.exist err
              res.should.equal "OK"
              test.done()
      
              
          "setWaitTimeout / setImplicitWaitTimeout": (test) ->
            async.series [
              # using old name
              (done) -> browser.setWaitTimeout 0, (err) ->
                should.not.exist err
                done null     
              executeCoffee browser,   
                """
                  setTimeout ->
                    $('#setWaitTimeout').html '<div class="child">a child</div>'
                  , 1000
                """
              (done) ->
                browser.elementByCss "#setWaitTimeout .child", (err,res) ->            
                  should.exist err
                  err.status.should.equal 7
                  done(null)  
              (done) -> browser.setImplicitWaitTimeout 2000, (err) ->
                should.not.exist err
                done null             
              (done) ->
                browser.elementByCss "#setWaitTimeout .child", (err,res) ->            
                  # now it works
                  should.not.exist err
                  should.exist res
                  done(null)          
              (done) -> browser.setImplicitWaitTimeout 0, (err) ->
                should.not.exist err
                done null             
            ], (err) ->
              should.not.exist err
              test.done()        
      
            
          "setAsyncScriptTimeout": (test) ->
            async.series [
              (done) -> browser.setAsyncScriptTimeout 2000, (err) ->
                should.not.exist err
                done null     
              (done) -> 
                scriptAsCoffee =
                  """
                    [args...,done] = arguments
                    setTimeout ->
                      done "OK"
                    , 1000
                  """
                scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'
                browser.executeAsync scriptAsJs, (err,res) ->          
                  should.not.exist err
                  res.should.equal "OK"
                  done null
            ], (err) ->
              should.not.exist err
              test.done()
      */

      "element": function(test) {
        return async.series([
          function(done) {
            return browser.element("name", "elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.element("name", "elementByName2", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementByLinkText": function(test) {
        return async.series([
          function(done) {
            return browser.elementByLinkText("click helloByLinkText", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.elementByLinkText("click helloByLinkText2", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementById": function(test) {
        return async.series([
          function(done) {
            return browser.elementById("elementById", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.elementById("elementById2", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementByName": function(test) {
        return async.series([
          function(done) {
            return browser.elementByName("elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.elementByName("elementByName2", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementByCss": function(test) {
        return async.series([
          function(done) {
            return browser.elementByCss("#elementByCss", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              return done(null);
            });
          }, function(done) {
            return browser.elementByCss("#elementByCss2", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elements": function(test) {
        return async.series([
          function(done) {
            return browser.elements("name", "elementsByName", function(err, res) {
              should.not.exist(err);
              res.should.have.length(3);
              return done(null);
            });
          }, function(done) {
            return browser.elements("name", "elementsByName2", function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementsById": function(test) {
        return async.series([
          function(done) {
            return browser.elementsById("elementsById", function(err, res) {
              should.not.exist(err);
              res.should.have.length(3);
              return done(null);
            });
          }, function(done) {
            return browser.elementsById("elementsById2", function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementsByName": function(test) {
        return async.series([
          function(done) {
            return browser.elementsByName("elementsByName", function(err, res) {
              should.not.exist(err);
              res.should.have.length(3);
              return done(null);
            });
          }, function(done) {
            return browser.elementsByName("elementsByName2", function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementsByCss": function(test) {
        return async.series([
          function(done) {
            return browser.elementsByCss("#elementsByCss", function(err, res) {
              should.not.exist(err);
              res.should.have.length(2);
              return done(null);
            });
          }, function(done) {
            return browser.elementsByCss("#elementsByCss2", function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "elementsByLinkText": function(test) {
        return async.series([
          function(done) {
            return browser.elementsByLinkText("click elementsByLinkText", function(err, res) {
              should.not.exist(err);
              res.should.have.length(2);
              return done(null);
            });
          }, function(done) {
            return browser.elementsByLinkText("click elementsByLinkText2", function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "getAttribute": function(test) {
        return browser.elementById("getAttribute", function(err, testDiv) {
          should.not.exist(err);
          should.exist(testDiv);
          return async.series([
            function(done) {
              return browser.getAttribute(testDiv, "weather", function(err, res) {
                should.not.exist(err);
                res.should.equal("sunny");
                return done(null);
              });
            }, function(done) {
              return browser.getAttribute(testDiv, "timezone", function(err, res) {
                should.not.exist(err);
                should.not.exist(res);
                return done(null);
              });
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "getValue (input)": function(test) {
        return browser.elementByCss("#getValue input", function(err, inputField) {
          should.not.exist(err);
          should.exist(inputField);
          return browser.getValue(inputField, function(err, res) {
            should.not.exist(err);
            res.should.equal("Hello getValueTest!");
            return test.done();
          });
        });
      },
      "getValue (textarea)": function(test) {
        return browser.elementByCss("#getValue textarea", function(err, inputField) {
          should.not.exist(err);
          should.exist(inputField);
          return browser.getValue(inputField, function(err, res) {
            should.not.exist(err);
            res.should.equal("Hello getValueTest2!");
            return test.done();
          });
        });
      },
      "clickElement": function(test) {
        return browser.elementByCss("#clickElement a", function(err, anchor) {
          should.not.exist(err);
          should.exist(anchor);
          return async.series([
            executeCoffee(browser, 'jQuery ->\n  a = $(\'#clickElement a\')\n  a.click ->\n    a.html \'clicked\'              '), function(done) {
              return textShouldEqual(browser, anchor, "not clicked", done);
            }, function(done) {
              return browser.clickElement(anchor, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return textShouldEqual(browser, anchor, "clicked", done);
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "moveTo": function(test) {
        var env;
        env = {};
        return async.series([
          elementByCss(browser, env, "#moveTo .a1", 'a1'), elementByCss(browser, env, "#moveTo .a2", 'a2'), elementByCss(browser, env, "#moveTo .current", 'current'), function(done) {
            return textShouldEqual(browser, env.current, '', done);
          }, executeCoffee(browser, 'jQuery ->\n  a1 = $(\'#moveTo .a1\')\n  a2 = $(\'#moveTo .a2\')\n  current = $(\'#moveTo .current\')\n  a1.hover ->\n    current.html \'a1\'\n  a2.hover ->\n    current.html \'a2\''), function(done) {
            return textShouldEqual(browser, env.current, '', done);
          }, function(done) {
            return browser.moveTo(env.a1, 5, 5, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return textShouldEqual(browser, env.current, 'a1', done);
          }, function(done) {
            return browser.moveTo(env.a2, void 0, void 0, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return textShouldEqual(browser, env.current, 'a2', done);
          }, function(done) {
            return browser.moveTo(env.a1, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return textShouldEqual(browser, env.current, 'a1', done);
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "buttonDown / buttonUp": function(test) {
        var env;
        env = {};
        return async.series([
          elementByCss(browser, env, "#mouseButton a", 'a'), elementByCss(browser, env, "#mouseButton div", 'resDiv'), executeCoffee(browser, 'jQuery ->\n  a = $(\'#mouseButton a\')\n  resDiv = $(\'#mouseButton div\')\n  a.mousedown ->\n    resDiv.html \'button down\'\n  a.mouseup ->\n    resDiv.html \'button up\''), function(done) {
            return textShouldEqual(browser, env.resDiv, '', done);
          }, function(done) {
            return browser.moveTo(env.a, void 0, void 0, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.buttonDown(function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return textShouldEqual(browser, env.resDiv, 'button down', done);
          }, function(done) {
            return browser.buttonUp(function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return textShouldEqual(browser, env.resDiv, 'button up', done);
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "click": function(test) {
        return browser.elementByCss("#click a", function(err, anchor) {
          should.not.exist(err);
          should.exist(anchor);
          return async.series([
            executeCoffee(browser, 'jQuery ->\n  window.numOfClick = 0\n  a = $(\'#click a\')\n  a.click ->\n    window.numOfClick = window.numOfClick + 1\n    a.html "clicked #{window.numOfClick}"              '), function(done) {
              return textShouldEqual(browser, anchor, "not clicked", done);
            }, function(done) {
              return browser.moveTo(anchor, void 0, void 0, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return browser.click(0, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return textShouldEqual(browser, anchor, "clicked 1", done);
            }, function(done) {
              return browser.moveTo(anchor, void 0, void 0, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return browser.click(function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return textShouldEqual(browser, anchor, "clicked 2", done);
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "doubleclick": function(test) {
        return browser.elementByCss("#doubleclick a", function(err, anchor) {
          should.not.exist(err);
          should.exist(anchor);
          return async.series([
            executeCoffee(browser, 'jQuery ->\n  a = $(\'#doubleclick a\')\n  a.click ->\n    a.html \'doubleclicked\'              '), function(done) {
              return textShouldEqual(browser, anchor, "not clicked", done);
            }, function(done) {
              return browser.moveTo(anchor, void 0, void 0, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return browser.doubleclick(0, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return textShouldEqual(browser, anchor, "doubleclicked", done);
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "type": function(test) {
        return browser.elementByCss("#type input", function(err, inputField) {
          should.not.exist(err);
          should.exist(inputField);
          return async.series([
            function(done) {
              return valueShouldEqual(browser, inputField, "", done);
            }, function(done) {
              return browser.type(inputField, "Hello World", function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return valueShouldEqual(browser, inputField, "Hello World", done);
            }, function(done) {
              return browser.type(inputField, "\n", function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return valueShouldEqual(browser, inputField, "Hello World", done);
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "clear": function(test) {
        return browser.elementByCss("#clear input", function(err, inputField) {
          should.not.exist(err);
          should.exist(inputField);
          return async.series([
            function(done) {
              return valueShouldEqual(browser, inputField, "not cleared", done);
            }, function(done) {
              return browser.clear(inputField, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return valueShouldEqual(browser, inputField, "", done);
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "title": function(test) {
        return browser.title(function(err, title) {
          should.not.exist(err);
          title.should.equal("TEST PAGE");
          return test.done();
        });
      },
      "text (passing element)": function(test) {
        return browser.elementByCss("#text", function(err, textDiv) {
          should.not.exist(err);
          should.exist(textDiv);
          return browser.text(textDiv, function(err, res) {
            should.not.exist(err);
            res.should.include("text content");
            res.should.not.include("div");
            return test.done();
          });
        });
      },
      "text (passing undefined)": function(test) {
        return browser.text(void 0, function(err, res) {
          should.not.exist(err);
          res.should.include("text content");
          res.should.include("sunny");
          res.should.include("click elementsByLinkText");
          res.should.not.include("div");
          return test.done();
        });
      },
      "text (passing body)": function(test) {
        return browser.text('body', function(err, res) {
          should.not.exist(err);
          res.should.include("text content");
          res.should.include("sunny");
          res.should.include("click elementsByLinkText");
          res.should.not.include("div");
          return test.done();
        });
      },
      "text (passing null)": function(test) {
        return browser.text(null, function(err, res) {
          should.not.exist(err);
          res.should.include("text content");
          res.should.include("sunny");
          res.should.include("click elementsByLinkText");
          res.should.not.include("div");
          return test.done();
        });
      },
      "textPresent": function(test) {
        return browser.elementByCss("#textPresent", function(err, textDiv) {
          should.not.exist(err);
          should.exist(textDiv);
          return async.series([
            function(done) {
              return browser.textPresent('sunny', textDiv, function(err, res) {
                should.not.exist(err);
                res.should.be["true"];
                return done(null);
              });
            }, function(done) {
              return browser.textPresent('raining', textDiv, function(err, res) {
                should.not.exist(err);
                res.should.be["false"];
                return done(null);
              });
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "acceptAlert": function(test) {
        return browser.elementByCss("#acceptAlert a", function(err, a) {
          should.not.exist(err);
          should.exist(a);
          return async.series([
            executeCoffee(browser, "jQuery ->            \n  a = $('#acceptAlert a')\n  a.click ->\n    alert \"coffee is running out\""), function(done) {
              return browser.clickElement(a, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              return browser.acceptAlert(function(err) {
                should.not.exist(err);
                return done(null);
              });
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "dismissAlert": function(test) {
        return browser.elementByCss("#dismissAlert a", function(err, a) {
          var capabilities;
          should.not.exist(err);
          should.exist(a);
          capabilities = null;
          return async.series([
            function(done) {
              return browser.sessionCapabilities(function(err, res) {
                should.not.exist(err);
                capabilities = res;
                return done(null);
              });
            }, executeCoffee(browser, "jQuery ->                        \n  a = $('#dismissAlert a')\n  a.click ->\n    alert \"coffee is running out\""), function(done) {
              return browser.clickElement(a, function(err) {
                should.not.exist(err);
                return done(null);
              });
            }, function(done) {
              if (!(capabilities.platform === 'MAC' && capabilities.browserName === 'chrome')) {
                return browser.dismissAlert(function(err) {
                  should.not.exist(err);
                  return done(null);
                });
              } else {
                return browser.acceptAlert(function(err) {
                  should.not.exist(err);
                  return done(null);
                });
              }
            }
          ], function(err) {
            should.not.exist(err);
            return test.done();
          });
        });
      },
      "active": function(test) {
        var env;
        env = {};
        return async.series([
          elementByCss(browser, env, "#active .i1", 'i1'), elementByCss(browser, env, "#active .i2", 'i2'), function(done) {
            return browser.clickElement(env.i1, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.active(function(err, res) {
              should.not.exist(err);
              res.should.equal(env.i1);
              return done(null);
            });
          }, function(done) {
            return browser.clickElement(env.i2, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.active(function(err, res) {
              should.not.exist(err);
              res.should.equal(env.i2);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "url": function(test) {
        return browser.url(function(err, res) {
          res.should.include("test-page.html");
          res.should.include("http://");
          return test.done();
        });
      },
      "allCookies / setCookies / deleteAllCookies / deleteCookie": function(test) {
        return async.series([
          function(done) {
            return browser.deleteAllCookies(function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.allCookies(function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }, function(done) {
            return browser.setCookie({
              name: 'fruit1',
              value: 'apple'
            }, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.allCookies(function(err, res) {
              should.not.exist(err);
              res.should.have.length(1);
              (res.filter(function(c) {
                return c.name === 'fruit1' && c.value === 'apple';
              })).should.have.length(1);
              return done(null);
            });
          }, function(done) {
            return browser.setCookie({
              name: 'fruit2',
              value: 'pear'
            }, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.allCookies(function(err, res) {
              should.not.exist(err);
              res.should.have.length(2);
              (res.filter(function(c) {
                return c.name === 'fruit2' && c.value === 'pear';
              })).should.have.length(1);
              return done(null);
            });
          }, function(done) {
            return browser.setCookie({
              name: 'fruit3',
              value: 'orange'
            }, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.allCookies(function(err, res) {
              should.not.exist(err);
              res.should.have.length(3);
              return done(null);
            });
          }, function(done) {
            return browser.deleteCookie('fruit2', function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.allCookies(function(err, res) {
              should.not.exist(err);
              res.should.have.length(2);
              (res.filter(function(c) {
                return c.name === 'fruit2' && c.value === 'pear';
              })).should.have.length(0);
              return done(null);
            });
          }, function(done) {
            return browser.deleteAllCookies(function(err) {
              should.not.exist(err);
              return done(null);
            });
          }, function(done) {
            return browser.allCookies(function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              return done(null);
            });
          }, function(done) {
            return browser.setCookie({
              name: 'fruit3',
              value: 'orange',
              secure: true
            }, function(err) {
              should.not.exist(err);
              return done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          return test.done();
        });
      },
      "quit": function(test) {
        return browser.quit(function() {
          return test.done();
        });
      }
    };
  };

  app = null;

  exports.wd = {
    "per method test": {
      'starting express': function(test) {
        app = express.createServer();
        app.use(express["static"](__dirname + '/assets'));
        app.listen(8181);
        return test.done();
      },
      chrome: runTestWith({}, {
        browserName: 'chrome'
      }),
      firefox: runTestWith({}, {
        browserName: 'firefox'
      }),
      'stopping express': function(test) {
        app.close();
        return test.done();
      }
    }
  };

}).call(this);
