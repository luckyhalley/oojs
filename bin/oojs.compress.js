!function(){var t={name:"oojs",namespace:"",$oojs:function(){if(this.conf="undefined"!=typeof $oojs_config?$oojs_config:this.conf,"undefined"!=typeof window)this.global=this.conf.global||window,this.runtime="browser",this.setPath(this.conf.path);else if(global){{require("path")}this.global=this.conf.global||global,this.runtime="node",this.conf.path=this.conf.path||process.cwd()+"/src/",this.setPath(this.conf.path);var e=module.constructor,n=e.wrap;e.wrap=function(t){return t=t.replace(/define\s*&&\s*define\s*\(/gi,"define(module,"),n(t)},module.exports=this}this.conf.proxyName&&(Function.prototype[this.conf.proxyName]=this.proxy),this.global.define=this.proxy(this,this.define),this.global.oojs=t},conf:{global:!1,proxyName:"proxy",path:""},path:{},pathCache:{},getPath:function(t){var e=t?t.split("."):!1,n=this.path;if(e)for(var i=0,s=e.length;s>i;i++){var r=e[i].toLowerCase();if(!n[r])break;n=n[r]}return n._path},setPath:function(t,e){var n=this.path;if("object"!=typeof t){if(e)for(var i=t.split("."),s=0,r=i.length;r>s;s++){var a=i[s].toLowerCase();n[a]=n[a]||{},n=n[a]}else e=t;e&&e.lastIndexOf("\\")!==e.length-1&&e.lastIndexOf("/")!==e.length-1&&(e+="/"),n._path=e}else for(var o in t)o&&t.hasOwnProperty(o)&&this.setPath(o,t[o])},getClassPath:function(t){return this.pathCache[t]||(this.pathCache[t]=this.getPath(t)+t.replace(/\./gi,"/")+".js"),this.pathCache[t]},loadDeps:function(t,e){e=e||{};var n=t.deps,i=!0;for(var s in n)if(s&&n.hasOwnProperty(s)&&n[s]){var r=n[s];if(t[s]=this.find(r),e&&e[r])continue;if(e[r]=!0,t[s])t[s].deps&&(i=i&&this.loadDeps(t[s],e));else{if("node"===this.runtime)try{t[s]=require(this.getClassPath(r))}catch(a){}t[s]||(i=!1)}}return i},fastClone:function(t){var e=function(){};e.prototype=t;var n=new e;return n},proxy:function(){var t=Array.prototype.slice.apply(arguments),e=t.shift(),n="function"==typeof this?this:t.shift();return function(){var i=Array.prototype.slice.apply(arguments);return n.apply(e,i.concat(t))}},config:function(t){for(var e in t)e&&t.hasOwnProperty(e)&&("path"===e?this.setPath(t[e]):this.conf[e]=t[e])},create:function(t){var e=Array.prototype.slice.call(arguments,0);e.shift();var n=t.name||"init",i=function(t){this[n]=this[n]||function(){},this[n].apply(this,t)};i.prototype=t;var s=new i(e);for(var r in t){var a=t[r];a&&t.hasOwnProperty(r)&&"object"==typeof a&&(s[r]=this.fastClone(a))}return s.instances=null,s},define:function(t,e){e||(e=t);var n=e.name;e.namespace=e.namespace||"",e.dispose=e.dispose||function(){};for(var i,s=e.namespace.split("."),r=s.length,a=this.global,o=0;r>o;o++)i=s[o],i&&(a[i]=a[i]||{},a=a[i]);a[n]=a[n]||{};var l=!1;if(a[n].name&&a[n]._registed){if(a[n]._registed){for(var h in e)h&&e.hasOwnProperty(h)&&"undefined"==typeof a[n][h]&&(l=!0,a[n][h]=e[h]);if(e=a[n],!l)return this}}else e._registed=!0,a[n]=e;e=a[n];var f=this.loadDeps(e);if(!f&&"browser"===this.runtime&&this.loadDepsBrowser)this.loadDepsBrowser(e);else{var c="$"+n;e[c]&&e[c]()}return t&&"node"===this.runtime&&(t.exports=e),this},find:function(t){var e,n=t.split(".");e=this.global[n[0]];for(var i=1,s=n.length;s>i;i++){if(!e||!e[n[i]]){e=null;break}e=e[n[i]]}return e},using:function(t){var e=this.find(t);return e||"node"===this.runtime&&(require(this.getClassPath(t)),e=this.find(t)),e}};return t.$oojs(),t.define("undefined"!=typeof module?module:null,t),t}(),define&&define({name:"event",namespace:"oojs",eventList:null,groupList:null,eventGroupIndexer:null,$event:function(){},event:function(){this.eventList={},this.groupList={},this.eventGroupIndexer={}},bind:function(t,e){var n=this.eventList[t]=this.eventList[t]||{};return(n.callbacks=n.callbacks||[]).push(e),n.status=!1,this},removeListener:function(t,e){if(this.eventList[t]){var n=this.eventList[t];if(n.callbacks&&n.callbacks.length)for(var i=0,s=n.callbacks.length;s>i;i++)if(e){if(e===n.callbacks[i]){n.callbacks[i]=null;break}}else n.callbacks[i]=null}},unbind:function(t,e){if(t||e)this.removeListener(t,e);else{var n;for(n in this.eventList)n&&this.eventList[n]&&this.eventList.hasOwnProperty(n)&&this.removeListener(n)}},emit:function(t,e){var n=this.eventList[t];if(n&&n.callbacks&&n.callbacks.length){var i=n.callbacks.length;n.data=[];for(var s=0;i>s;s++){var r=n.callbacks[s];r&&n.data.push(r(e))}n.callbacks=null,n.status=!0}for(var a,o=this.eventGroupIndexer[t]||[],s=0,l=o.length;l>s;s++)a=o[s],a&&this.groupEmit(a)},group:function(t,e,n){this.groupList[t]=this.groupList[t]||{};var i=this.groupList[t],s=i.events=i.events||{};n&&(i.callbacks=i.callbacks||[]).push(n);for(var r,e=e||[],a=0,o=e.length;o>a;a++)r=e[a],s[r]=1,(this.eventGroupIndexer[r]=this.eventGroupIndexer[r]||[]).push(t)},groupEmit:function(t){var e=this.groupList[t];if(e){var n,i,s=e.events=e.events||{},r=!0,a={};for(n in s)if(n&&s.hasOwnProperty(n)){if(i=this.eventList[n],!i||!i.status){r=!1,a=null;break}a[n]=i.data}if(n=null,r){e.callbacks=e.callbacks||[];for(var o,l=e.callbacks,h=l.length||0,f=0;h>f;f++)o=e.callbacks[f],o&&(o(a),e.callbacks[f]=null);o=null,e.callbacks=null;for(var c,u=e.afters=e.afters||[],h=u.length||0,f=0;h>f;f++)c=u[f],c&&(c(a),u[f]=null);c=null,e.afters=null}}},afterGroup:function(t,e){var n=this.groupList[t]=this.groupList[t]||{},i=n.afters=n.afters||[];i.push(e)}}),define&&define({name:"oojs",namespace:"",$oojs:function(){this.ev=oojs.create(oojs.event)},isNullObj:function(t){for(var e in t)if(t.hasOwnProperty(e))return!1;return!0},loadScript:function(t,e,n){if("function"==typeof e&&(n=e,e="1.0.0"),e=e||"1.0.0",t.indexOf("http")<0&&(t=this.basePath+t.replace(/\./g,"/")+".js"),e&&(t+="?v="+e),n=n||function(){},this.ev.bind(t,function(t,e){e&&e()}.proxy(this,n)),this.loading=this.loading||{},!this.loading[t]){this.loading[t]=1;var i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src=t,i.onload=i.onerror=i.onreadystatechange=function(t,e,n){"string"==typeof t&&(e=t,n=e),/loaded|complete|undefined/.test(n.readyState)&&(n.onload=n.onerror=n.onreadystatechange=null,n=void 0,this.ev.emit(e,1))}.proxy(this,t,i);var s=document.getElementsByTagName("script")[0];return s.parentNode.insertBefore(i,s),this}},loadDepsBrowser:function(t){var e=t.deps,n="$"+t.name;if(this.isNullObj(e))t[n]&&t[n]();else for(var i in e)if(i&&e.hasOwnProperty(i)){var s=e[i],r=this.using(s);if(r){t[i]=r;continue}this.ev.bind(s,function(t,e){return oojs.using(e)}.proxy(this,s)),this.ev.group("loadDeps",[s],function(t,e,n,i){i[e]=t[n][0]}.proxy(this,i,s,t)),this.ev.afterGroup("loadDeps",function(){var e="$"+t.name;t[e]&&t[e]()}.proxy(this,t));var a=this.basePath+s.replace(/\./gi,"/")+".js",o=function(t){this.ev.emit(t)}.proxy(this,s);this.loadScript(a,o)}return this}});