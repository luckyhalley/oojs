!function(){var e={name:"oojs",namespace:"","class":{},$oojs:function(e){if(e=e||{},"undefined"!=typeof window&&"undefined"!=typeof document?(this.runtime="browser",e.global=window):(this.runtime="node",e.global=global),e.proxyName="proxy",e.path="node"===this.runtime?process.cwd()+"/src/":"","undefined"!=typeof $oojs_config)for(var t in $oojs_config)t&&$oojs_config.hasOwnProperty(t)&&(e[t]=$oojs_config[t]);this.global=e.global||{},e.proxyName&&(Function.prototype[e.proxyName]=this.proxy),this.setPath(e.path),this.global.oojs=this.global.oojs||this},path:{},pathCache:{},getPath:function(e){var t=e?e.split("."):!1,r=this.path;if(t)for(var n=0,a=t.length;a>n;n++){var s=t[n].toLowerCase();if(!r[s])break;r=r[s]}return r._path},setPath:function(e,t){var r=this.path;if("object"!=typeof e){if(t)for(var n=e.split("."),a=0,s=n.length;s>a;a++){var i=n[a].toLowerCase();r[i]=r[i]||{_path:r._path},r=r[i]}else t=e;t&&t.lastIndexOf("\\")!==t.length-1&&t.lastIndexOf("/")!==t.length-1&&(t+="/"),r._path=t}else for(var o in e)o&&e.hasOwnProperty(o)&&this.setPath(o,e[o])},getClassPath:function(e){return this.pathCache[e]||(this.pathCache[e]=this.getPath(e)+e.replace(/\./gi,"/")+".js"),this.pathCache[e]},loadDeps:function(e,t){t=t||{};var r=e.deps,n=[];for(var a in r)if(a&&r.hasOwnProperty(a)&&r[a]){var s;if("string"!=typeof r[a]?(e[a]=r[a],e[a]&&e[a].name&&(e[a].namespace=e[a].namespace||"",s=e[a].namespace+e[a].name)):(s=r[a],e[a]=this.find(s)),!s||t[s])continue;if(t[s]=!0,e[a])e[a].deps&&(n=n.concat(this.loadDeps(e[a],t)));else{if("node"===this.runtime&&(e[a]=require(this.getClassPath(s)),!e[a]))throw new Error(e.name+" loadDeps failed: "+s);e[a]||n.push(s)}}return n},fastClone:function(e){var t=function(){};t.prototype=e;var r=new t;return r},proxy:function(){var e=Array.prototype.slice.apply(arguments),t=e.shift(),r="function"==typeof this?this:e.shift();return function(){var n=Array.prototype.slice.apply(arguments);return r.apply(t,n.concat(e))}},config:function(){for(var e in obj)e&&obj.hasOwnProperty(e)&&("path"===e||"basePath"===e)&&this.setPath(obj[e])},create:function(e){var t=Array.prototype.slice.call(arguments,0);if(t.shift(),"string"==typeof e&&(e=this.using(e)),!e||!e.name)throw new Error("oojs.create need a class object with a name property");var r="__"+e.name||"init",n=function(){};n.prototype=e;var a=new n;for(var s in e){var i=e[s];i&&e.hasOwnProperty(s)&&"object"==typeof i&&(a[s]=this.fastClone(i))}return a[r]=a[r]||function(){},a[r].apply(a,t),a.instances=null,a},define:function(e){var t=e.name,r="$"+t;e.namespace=e.namespace||"",e.dispose=e.dispose||function(){},e["__"+t]=e[t]||function(){};for(var n,a=!1,s=!1,i=e.namespace.split("."),o=i.length,h=this.class,f=0;o>f;f++)n=i[f],n&&(h[n]=h[n]||{},h=h[n]);if(h[t]=h[t]||{},h[t].name&&h[t]._registed){if(h[t]._registed){a=!0;for(var p in e)p&&e.hasOwnProperty(p)&&"undefined"==typeof h[t][p]&&(s=!0,h[t][p]=e[p])}}else e._registed=!0,h[t]=e;if(e=h[t],!a||s){var l=this.loadDeps(e);if(l.length>0){if(this.loader=this.loader||this.using("oojs.loader"),"browser"!==this.runtime||!this.loader)throw new Error('class "'+e.name+'" loadDeps error:'+l.join(","));this.loader.loadDepsBrowser(e)}else e[r]&&e[r]()}return"node"===this.runtime&&arguments.callee.caller.arguments[2]&&(arguments.callee.caller.arguments[2].exports=e),this},find:function(e){var t,r=e.split(".");t=this.class[r[0]];for(var n=1,a=r.length;a>n;n++){if(!t||!t[r[n]]){t=null;break}t=t[r[n]]}return t},using:function(e){var t=this.find(e);return t||"node"===this.runtime&&(require(this.getClassPath(e)),t=this.find(e)),t},reload:function(e){var t=this.find(e);if(t){if(t._registed=!1,"node"===this.runtime){var r=this.getClassPath(e);delete require.cache[require.resolve(r)],t=require(r)}}else t=this.using(e);return t}};e.define(e)}();