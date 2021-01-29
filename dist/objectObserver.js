!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ObjectObserver=t():e.ObjectObserver=t()}(window,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t),r.d(t,"Watcher",(function(){return W})),r.d(t,"watch",(function(){return _})),r.d(t,"unWatch",(function(){return E}));var n=arguments;function o(e){return f(e)||u(e)||l(e)||i()}function i(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function f(e){if(Array.isArray(e))return c(e)}function a(e,t){var r;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(r=l(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,f=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return u=e.done,e},e:function(e){f=!0,i=e},f:function(){try{u||null==r.return||r.return()}finally{if(f)throw i}}}}function l(e,t){if(e){if("string"==typeof e)return c(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(e,t):void 0}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var s=Symbol("callBackProxy"),b=Symbol("watchConfigsSymbol"),d=Symbol("watchSymbol"),p=Symbol("watchDepthSymbol"),v=function(e){return"[object Array]"===toString.call(e)},h=function(e){return null!==e&&"[object Object]"===toString.call(e)},m=function e(t,r){if(t===r)return!0;if(v(t)&&v(r))return t.length===r.length&&t.every((function(t,n){return e(t,r[n])}));if(h(t)&&h(r)){var n=Object.keys(t);return n.length===Object.keys(r).length&&n.every((function(n){return r.hasOwnProperty&&r.hasOwnProperty(n)&&e(t[n],r[n])}))}return!1},g=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,t="",r=0;r<e;r++)t+=Math.floor(10*Math.random());return t},S=function e(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new WeakMap;if("object"!==y(t)||null===t)return t;if(r>0&&n>r)return Array.isArray(t)?[]:{};if(o.has(t))return o.get(t);var i=Array.isArray(t)?[]:{};for(var u in o.set(t,i),t)Object.prototype.hasOwnProperty.call(t,u)&&(i[u]=e(t[u],r,n+1,o));return i},j=new WeakSet,w=function(e,t,r,n){if(!j.has(e)&&!m(t,r)){j.add(e);var o,i=g(8),u=a(e);try{for(u.s();!(o=u.n()).done;){var f=o.value;f&&f("before-set",i)}}catch(e){u.e(e)}finally{u.f()}return n(r),Promise.resolve().then((function(){var t,r=a(e);try{for(r.s();!(t=r.n()).done;){var n=t.value;n&&n("after-set",i)}}catch(e){r.e(e)}finally{r.f()}j.delete(e)})),!0}return!1},O=function(e,t){return!(t===s||t===p||t===b||!w(e[s],0,1,(function(){Reflect.deleteProperty(e,t)})))||Reflect.deleteProperty.apply(Reflect,o(n))},A=function(e,t,r,n,o,i){return t!==s&&t!==d&&t!==b&&("object"===y(r)&&!r[s]&&(0===o||i<o)&&Object.isExtensible(r)&&(r[s]=e[s],x(r=P(r,o,i+1),o,i+1)),w(e[s],e[t],r,n))||n(r),!0},P=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2?arguments[2]:void 0;return new Proxy(e,{defineProperty:function(e,n,o){return o.hasOwnProperty("value")?A(e,n,o.value,(function(t){o.value=t,Reflect.defineProperty(e,n,o)}),t,r):Reflect.defineProperty.apply(Reflect,arguments)},set:function(e,n,o,i){return A(e,n,o,(function(t){Reflect.set(e,n,t)}),t,r)},deleteProperty:O})};function x(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;if(1===r){if(e[s])return e;e[s]=[]}for(var n=0,o=Object.keys(e);n<o.length;n++){var i=o[n];"object"===y(e[i])&&!e[i][s]&&(0===t||r<t)&&Object.isExtensible(e[i])&&(e[i][s]=e[s],e[i]=P(e[i],t,r+1),x(e[i],t,r+1))}if(!(r>1))return P(e,t,r)}function k(e){return(k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function M(e,t){var r;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(r=I(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,f=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return u=e.done,e},e:function(e){f=!0,i=e},f:function(){try{u||null==r.return||r.return()}finally{if(f)throw i}}}}function I(e,t){if(e){if("string"==typeof e)return R(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?R(e,t):void 0}}function R(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function W(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return e[p]=t,x(e,t)}function _(e,t,r){e.hasOwnProperty(s)||(e=W(e));var n=e[p]||0;if(e[b]||(e[b]=new WeakMap),!e[b].has(t)){var o;t[d]={};var i=function(){var i=arguments[0],u=arguments[1];switch(i){case"before-set":for(var f in o=S(e,n),t[d][u]={},t)if("*"===f)t[d][u][f]={old:o};else{var a,l=f.split("."),c=o,y=M(l);try{for(y.s();!(a=y.n()).done;){var s=a.value;if("object"!=k(c)){c=void 0;break}c=c[s]}}catch(e){y.e(e)}finally{y.f()}t[d][u][f]={old:c}}break;case"after-set":var b=S(e,n);if(!t[d][u])return;if(Object.keys(t[d][u]).length>0)for(var p in t[d][u]){var v=void 0;if("*"===p)v=b;else{var h,g=p.split("."),j=b,w=M(g);try{for(w.s();!(h=w.n()).done;){var O=h.value;if("object"!=k(j)){j=void 0;break}j=j[O]}}catch(e){w.e(e)}finally{w.f()}v=j}var A=t[d][u][p].old;if("*"===p||!m(v,A)){var P="function"==typeof t[p]?t[p]:t[p].handler;P&&P.call(r,v,A)}}delete t[d][u],o=null}};e[b].set(t,i),e[s].includes(i)||e[s].push(i)}}function E(e,t){if(!t)return e[b]=new WeakMap,void e[s].splice(0);if(e[b].has(t)){var r=e[b].get(t);e[s].includes(r)&&e[s].splice(e[s].indexOf(r),1),e[b].delete(t)}}}])}));