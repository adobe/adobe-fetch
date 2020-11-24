module.exports["@adobe/fetch"]=(()=>{var e={223:(e,t,r)=>{const n=r(667),o=r(390);e.exports={config:n.getConfig(o),normalizeHeaders:n.normalizeHeaders,generateRequestID:n.generateRequestID,AUTH_MODES:n.AUTH_MODES}},227:(e,t,r)=>{t.formatArgs=function(t){if(t[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+t[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const r="color: "+this.color;t.splice(1,0,r,"color: inherit");let n=0,o=0;t[0].replace(/%[a-zA-Z%]/g,(e=>{"%%"!==e&&(n++,"%c"===e&&(o=n))})),t.splice(o,0,r)},t.save=function(e){try{e?t.storage.setItem("debug",e):t.storage.removeItem("debug")}catch(e){}},t.load=function(){let e;try{e=t.storage.getItem("debug")}catch(e){}return!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG),e},t.useColors=function(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type&&!window.process.__nwjs)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))},t.storage=function(){try{return localStorage}catch(e){}}(),t.destroy=(()=>{let e=!1;return()=>{e||(e=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],t.log=console.debug||console.log||(()=>{}),e.exports=r(447)(t);const{formatters:n}=e.exports;n.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}},447:(e,t,r)=>{e.exports=function(e){function t(e){let r,o=null;function s(...e){if(!s.enabled)return;const n=s,o=Number(new Date),a=o-(r||o);n.diff=a,n.prev=r,n.curr=o,r=o,e[0]=t.coerce(e[0]),"string"!=typeof e[0]&&e.unshift("%O");let i=0;e[0]=e[0].replace(/%([a-zA-Z%])/g,((r,o)=>{if("%%"===r)return"%";i++;const s=t.formatters[o];if("function"==typeof s){const t=e[i];r=s.call(n,t),e.splice(i,1),i--}return r})),t.formatArgs.call(n,e),(n.log||t.log).apply(n,e)}return s.namespace=e,s.useColors=t.useColors(),s.color=t.selectColor(e),s.extend=n,s.destroy=t.destroy,Object.defineProperty(s,"enabled",{enumerable:!0,configurable:!1,get:()=>null===o?t.enabled(e):o,set:e=>{o=e}}),"function"==typeof t.init&&t.init(s),s}function n(e,r){const n=t(this.namespace+(void 0===r?":":r)+e);return n.log=this.log,n}function o(e){return e.toString().substring(2,e.toString().length-2).replace(/\.\*\?$/,"*")}return t.debug=t,t.default=t,t.coerce=function(e){return e instanceof Error?e.stack||e.message:e},t.disable=function(){const e=[...t.names.map(o),...t.skips.map(o).map((e=>"-"+e))].join(",");return t.enable(""),e},t.enable=function(e){let r;t.save(e),t.names=[],t.skips=[];const n=("string"==typeof e?e:"").split(/[\s,]+/),o=n.length;for(r=0;r<o;r++)n[r]&&("-"===(e=n[r].replace(/\*/g,".*?"))[0]?t.skips.push(new RegExp("^"+e.substr(1)+"$")):t.names.push(new RegExp("^"+e+"$")))},t.enabled=function(e){if("*"===e[e.length-1])return!0;let r,n;for(r=0,n=t.skips.length;r<n;r++)if(t.skips[r].test(e))return!1;for(r=0,n=t.names.length;r<n;r++)if(t.names[r].test(e))return!0;return!1},t.humanize=r(824),t.destroy=function(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")},Object.keys(e).forEach((r=>{t[r]=e[r]})),t.names=[],t.skips=[],t.formatters={},t.selectColor=function(e){let r=0;for(let t=0;t<e.length;t++)r=(r<<5)-r+e.charCodeAt(t),r|=0;return t.colors[Math.abs(r)%t.colors.length]},t.enable(t.load()),t}},824:e=>{var t=1e3,r=60*t,n=60*r,o=24*n;function s(e,t,r,n){var o=t>=1.5*r;return Math.round(e/r)+" "+n+(o?"s":"")}e.exports=function(e,a){a=a||{};var i,c,u=typeof e;if("string"===u&&e.length>0)return function(e){if(!((e=String(e)).length>100)){var s=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(s){var a=parseFloat(s[1]);switch((s[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*a;case"weeks":case"week":case"w":return 6048e5*a;case"days":case"day":case"d":return a*o;case"hours":case"hour":case"hrs":case"hr":case"h":return a*n;case"minutes":case"minute":case"mins":case"min":case"m":return a*r;case"seconds":case"second":case"secs":case"sec":case"s":return a*t;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return a;default:return}}}}(e);if("number"===u&&isFinite(e))return a.long?(i=e,(c=Math.abs(i))>=o?s(i,c,o,"day"):c>=n?s(i,c,n,"hour"):c>=r?s(i,c,r,"minute"):c>=t?s(i,c,t,"second"):i+" ms"):function(e){var s=Math.abs(e);return s>=o?Math.round(e/o)+"d":s>=n?Math.round(e/n)+"h":s>=r?Math.round(e/r)+"m":s>=t?Math.round(e/t)+"s":e+"ms"}(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},614:(e,t,r)=>{"use strict";r.r(t),r.d(t,{NIL:()=>U,parse:()=>C,stringify:()=>d,v1:()=>h,v3:()=>A,v4:()=>x,v5:()=>$,validate:()=>i,version:()=>O});var n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),o=new Uint8Array(16);function s(){if(!n)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(o)}const a=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,i=function(e){return"string"==typeof e&&a.test(e)};for(var c=[],u=0;u<256;++u)c.push((u+256).toString(16).substr(1));const d=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(c[e[t+0]]+c[e[t+1]]+c[e[t+2]]+c[e[t+3]]+"-"+c[e[t+4]]+c[e[t+5]]+"-"+c[e[t+6]]+c[e[t+7]]+"-"+c[e[t+8]]+c[e[t+9]]+"-"+c[e[t+10]]+c[e[t+11]]+c[e[t+12]]+c[e[t+13]]+c[e[t+14]]+c[e[t+15]]).toLowerCase();if(!i(r))throw TypeError("Stringified UUID is invalid");return r};var f,l,g=0,p=0;const h=function(e,t,r){var n=t&&r||0,o=t||new Array(16),a=(e=e||{}).node||f,i=void 0!==e.clockseq?e.clockseq:l;if(null==a||null==i){var c=e.random||(e.rng||s)();null==a&&(a=f=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==i&&(i=l=16383&(c[6]<<8|c[7]))}var u=void 0!==e.msecs?e.msecs:Date.now(),h=void 0!==e.nsecs?e.nsecs:p+1,C=u-g+(h-p)/1e4;if(C<0&&void 0===e.clockseq&&(i=i+1&16383),(C<0||u>g)&&void 0===e.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");g=u,p=h,l=i;var m=(1e4*(268435455&(u+=122192928e5))+h)%4294967296;o[n++]=m>>>24&255,o[n++]=m>>>16&255,o[n++]=m>>>8&255,o[n++]=255&m;var y=u/4294967296*1e4&268435455;o[n++]=y>>>8&255,o[n++]=255&y,o[n++]=y>>>24&15|16,o[n++]=y>>>16&255,o[n++]=i>>>8|128,o[n++]=255&i;for(var v=0;v<6;++v)o[n+v]=a[v];return t||d(o)},C=function(e){if(!i(e))throw TypeError("Invalid UUID");var t,r=new Uint8Array(16);return r[0]=(t=parseInt(e.slice(0,8),16))>>>24,r[1]=t>>>16&255,r[2]=t>>>8&255,r[3]=255&t,r[4]=(t=parseInt(e.slice(9,13),16))>>>8,r[5]=255&t,r[6]=(t=parseInt(e.slice(14,18),16))>>>8,r[7]=255&t,r[8]=(t=parseInt(e.slice(19,23),16))>>>8,r[9]=255&t,r[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,r[11]=t/4294967296&255,r[12]=t>>>24&255,r[13]=t>>>16&255,r[14]=t>>>8&255,r[15]=255&t,r};function m(e,t,r){function n(e,n,o,s){if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));for(var t=[],r=0;r<e.length;++r)t.push(e.charCodeAt(r));return t}(e)),"string"==typeof n&&(n=C(n)),16!==n.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var a=new Uint8Array(16+e.length);if(a.set(n),a.set(e,n.length),(a=r(a))[6]=15&a[6]|t,a[8]=63&a[8]|128,o){s=s||0;for(var i=0;i<16;++i)o[s+i]=a[i];return o}return d(a)}try{n.name=e}catch(e){}return n.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",n.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",n}function y(e){return 14+(e+64>>>9<<4)+1}function v(e,t){var r=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(r>>16)<<16|65535&r}function w(e,t,r,n,o,s){return v((a=v(v(t,e),v(n,s)))<<(i=o)|a>>>32-i,r);var a,i}function F(e,t,r,n,o,s,a){return w(t&r|~t&n,e,t,o,s,a)}function b(e,t,r,n,o,s,a){return w(t&n|r&~n,e,t,o,s,a)}function k(e,t,r,n,o,s,a){return w(t^r^n,e,t,o,s,a)}function I(e,t,r,n,o,s,a){return w(r^(t|~n),e,t,o,s,a)}const A=m("v3",48,(function(e){if("string"==typeof e){var t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(var r=0;r<t.length;++r)e[r]=t.charCodeAt(r)}return function(e){for(var t=[],r=32*e.length,n="0123456789abcdef",o=0;o<r;o+=8){var s=e[o>>5]>>>o%32&255,a=parseInt(n.charAt(s>>>4&15)+n.charAt(15&s),16);t.push(a)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[y(t)-1]=t;for(var r=1732584193,n=-271733879,o=-1732584194,s=271733878,a=0;a<e.length;a+=16){var i=r,c=n,u=o,d=s;r=F(r,n,o,s,e[a],7,-680876936),s=F(s,r,n,o,e[a+1],12,-389564586),o=F(o,s,r,n,e[a+2],17,606105819),n=F(n,o,s,r,e[a+3],22,-1044525330),r=F(r,n,o,s,e[a+4],7,-176418897),s=F(s,r,n,o,e[a+5],12,1200080426),o=F(o,s,r,n,e[a+6],17,-1473231341),n=F(n,o,s,r,e[a+7],22,-45705983),r=F(r,n,o,s,e[a+8],7,1770035416),s=F(s,r,n,o,e[a+9],12,-1958414417),o=F(o,s,r,n,e[a+10],17,-42063),n=F(n,o,s,r,e[a+11],22,-1990404162),r=F(r,n,o,s,e[a+12],7,1804603682),s=F(s,r,n,o,e[a+13],12,-40341101),o=F(o,s,r,n,e[a+14],17,-1502002290),r=b(r,n=F(n,o,s,r,e[a+15],22,1236535329),o,s,e[a+1],5,-165796510),s=b(s,r,n,o,e[a+6],9,-1069501632),o=b(o,s,r,n,e[a+11],14,643717713),n=b(n,o,s,r,e[a],20,-373897302),r=b(r,n,o,s,e[a+5],5,-701558691),s=b(s,r,n,o,e[a+10],9,38016083),o=b(o,s,r,n,e[a+15],14,-660478335),n=b(n,o,s,r,e[a+4],20,-405537848),r=b(r,n,o,s,e[a+9],5,568446438),s=b(s,r,n,o,e[a+14],9,-1019803690),o=b(o,s,r,n,e[a+3],14,-187363961),n=b(n,o,s,r,e[a+8],20,1163531501),r=b(r,n,o,s,e[a+13],5,-1444681467),s=b(s,r,n,o,e[a+2],9,-51403784),o=b(o,s,r,n,e[a+7],14,1735328473),r=k(r,n=b(n,o,s,r,e[a+12],20,-1926607734),o,s,e[a+5],4,-378558),s=k(s,r,n,o,e[a+8],11,-2022574463),o=k(o,s,r,n,e[a+11],16,1839030562),n=k(n,o,s,r,e[a+14],23,-35309556),r=k(r,n,o,s,e[a+1],4,-1530992060),s=k(s,r,n,o,e[a+4],11,1272893353),o=k(o,s,r,n,e[a+7],16,-155497632),n=k(n,o,s,r,e[a+10],23,-1094730640),r=k(r,n,o,s,e[a+13],4,681279174),s=k(s,r,n,o,e[a],11,-358537222),o=k(o,s,r,n,e[a+3],16,-722521979),n=k(n,o,s,r,e[a+6],23,76029189),r=k(r,n,o,s,e[a+9],4,-640364487),s=k(s,r,n,o,e[a+12],11,-421815835),o=k(o,s,r,n,e[a+15],16,530742520),r=I(r,n=k(n,o,s,r,e[a+2],23,-995338651),o,s,e[a],6,-198630844),s=I(s,r,n,o,e[a+7],10,1126891415),o=I(o,s,r,n,e[a+14],15,-1416354905),n=I(n,o,s,r,e[a+5],21,-57434055),r=I(r,n,o,s,e[a+12],6,1700485571),s=I(s,r,n,o,e[a+3],10,-1894986606),o=I(o,s,r,n,e[a+10],15,-1051523),n=I(n,o,s,r,e[a+1],21,-2054922799),r=I(r,n,o,s,e[a+8],6,1873313359),s=I(s,r,n,o,e[a+15],10,-30611744),o=I(o,s,r,n,e[a+6],15,-1560198380),n=I(n,o,s,r,e[a+13],21,1309151649),r=I(r,n,o,s,e[a+4],6,-145523070),s=I(s,r,n,o,e[a+11],10,-1120210379),o=I(o,s,r,n,e[a+2],15,718787259),n=I(n,o,s,r,e[a+9],21,-343485551),r=v(r,i),n=v(n,c),o=v(o,u),s=v(s,d)}return[r,n,o,s]}(function(e){if(0===e.length)return[];for(var t=8*e.length,r=new Uint32Array(y(t)),n=0;n<t;n+=8)r[n>>5]|=(255&e[n/8])<<n%32;return r}(e),8*e.length))})),x=function(e,t,r){var n=(e=e||{}).random||(e.rng||s)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(var o=0;o<16;++o)t[r+o]=n[o];return t}return d(n)};function S(e,t,r,n){switch(e){case 0:return t&r^~t&n;case 1:return t^r^n;case 2:return t&r^t&n^r&n;case 3:return t^r^n}}function E(e,t){return e<<t|e>>>32-t}const $=m("v5",80,(function(e){var t=[1518500249,1859775393,2400959708,3395469782],r=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){var n=unescape(encodeURIComponent(e));e=[];for(var o=0;o<n.length;++o)e.push(n.charCodeAt(o))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);for(var s=e.length/4+2,a=Math.ceil(s/16),i=new Array(a),c=0;c<a;++c){for(var u=new Uint32Array(16),d=0;d<16;++d)u[d]=e[64*c+4*d]<<24|e[64*c+4*d+1]<<16|e[64*c+4*d+2]<<8|e[64*c+4*d+3];i[c]=u}i[a-1][14]=8*(e.length-1)/Math.pow(2,32),i[a-1][14]=Math.floor(i[a-1][14]),i[a-1][15]=8*(e.length-1)&4294967295;for(var f=0;f<a;++f){for(var l=new Uint32Array(80),g=0;g<16;++g)l[g]=i[f][g];for(var p=16;p<80;++p)l[p]=E(l[p-3]^l[p-8]^l[p-14]^l[p-16],1);for(var h=r[0],C=r[1],m=r[2],y=r[3],v=r[4],w=0;w<80;++w){var F=Math.floor(w/20),b=E(h,5)+S(F,C,m,y)+v+t[F]+l[w]>>>0;v=y,y=m,m=E(C,30)>>>0,C=h,h=b}r[0]=r[0]+h>>>0,r[1]=r[1]+C>>>0,r[2]=r[2]+m>>>0,r[3]=r[3]+y>>>0,r[4]=r[4]+v>>>0}return[r[0]>>24&255,r[0]>>16&255,r[0]>>8&255,255&r[0],r[1]>>24&255,r[1]>>16&255,r[1]>>8&255,255&r[1],r[2]>>24&255,r[2]>>16&255,r[2]>>8&255,255&r[2],r[3]>>24&255,r[3]>>16&255,r[3]>>8&255,255&r[3],r[4]>>24&255,r[4]>>16&255,r[4]>>8&255,255&r[4]]})),U="00000000-0000-0000-0000-000000000000",O=function(e){if(!i(e))throw TypeError("Invalid UUID");return parseInt(e.substr(14,1),16)}},667:(e,t,r)=>{const n=r(265),{v4:o}=r(614),s=r(227)("@adobe/fetch"),a={JWT:"jwt",Provided:"provided"};function i(){return o().replace(/-/g,"")}function c(e){let t={};if(e)if("function"==typeof e.entries)for(let r of e.entries()){const[e,n]=r;t[e.toLowerCase()]=n}else for(let r in e)t[r.toLowerCase()]=e[r];return t}async function u(e,t,r,n,o,i){const d=await async function(e,t,r,n){const o=e.auth_key;let s=await t.get(o);if(s&&!r)return s;{let r;r=e.mode===a.JWT?async()=>await n(e):async()=>await e.tokenProvider();try{if(s=await r(),s)return t.set(o,s);throw"Access token empty"}catch(e){throw console.error("Error while getting a new access token.",e),e}}}(r.auth,n,o,i),f=Object.assign({},t);f.headers=function(e,t,r){let n=function(e){let t={};for(let r in e){const n=e[r];t[r]="function"==typeof n?n():n}return t}(r);var o;return t&&t.headers&&(n=Object.assign(n,c(t.headers))),n.authorization=`${o=e.token_type,o[0].toUpperCase()+o.slice(1)} ${e.access_token}`,n}(d,t,r.headers),s(`${f.method||"GET"} ${e} - x-request-id: ${f.headers["x-request-id"]}`);const l=await fetch(e,f);return l.ok||(s(`${f.method||"GET"} ${e} - status ${l.statusText} (${l.status}). x-request-id: ${f.headers["x-request-id"]}`),401!==l.status&&403!==l.status||o)?l:(s(`${t.method||"GET"} ${e} - Will get new token.`),await u(e,t,r,n,!0,i))}e.exports={getConfig:function(e,t){return r=>{!function(e,t){if(!e.auth)throw"Auth configuration missing.";e.auth.mode||(e.auth.mode=t?a.JWT:a.Provided),function(e,t){let{mode:r,clientId:n,technicalAccountId:o,orgId:s,clientSecret:i,privateKey:c,metaScopes:u,storage:d,tokenProvider:f}=e;const l=[];if(r===a.JWT){if(!n&&l.push("clientId"),!o&&l.push("technicalAccountId"),!s&&l.push("orgId"),!i&&l.push("clientSecret"),!c&&l.push("privateKey"),(!u||0===u.length)&&l.push("metaScopes"),!t)throw"JWT authentication is not available in current setup.";if(c&&!("string"==typeof c||c instanceof Buffer||ArrayBuffer.isView(c)))throw"Required parameter privateKey is invalid";l.length||(e.auth_key=`${n}|${u.join(",")}`)}else{if(r!==a.Provided)throw`Invalid authentication mode - ${e.mode}`;if(!n&&l.push("clientId"),!s&&l.push("orgId"),!f&&l.push("tokenProvider"),l.length||(e.auth_key=`${n}|org-${s}`),f&&"function"!=typeof f)throw"Required parameter tokenProvider needs to be a function"}if(l.length>0)throw`Required parameter(s) ${l.join(", ")} are missing`;if(d){let{read:e,write:t}=d;if(!e)throw"Storage read method missing!";if(!t)throw"Storage write method missing!"}}(e.auth,t),e.headers=Object.assign({"x-api-key":e.auth.clientId,"x-request-id":()=>i(),"x-gw-ims-org-id":e.auth.orgId},c(e.headers))}(r,!!t);const o=n.config(r.auth,e);return(e,n={})=>function(e,t,r,n,o){return u(e,t,r,n,!1,o)}(e,n,r,o,t)}},normalizeHeaders:c,generateRequestID:i,AUTH_MODES:a}},265:e=>{async function t(e){e.disableStorage||(e.tokens=await e.read()||{},e.readOnce=!0)}function r(e,t){return void 0!==t.tokens&&t.tokens[e]&&t.tokens[e].expires_at>Date.now()?t.tokens[e]:void 0}e.exports.config=function(e,n){const o=e&&e.disableStorage||!1,s={disableStorage:o,readOnce:o,read:e.storage?e.storage.read:n.read,write:e.storage?e.storage.write:n.write,tokens:{}};return{set:(e,r)=>async function(e,r,n){return r.expires_at=Date.now()+r.expires_in-6e4,await t(n),n.tokens[e]=r,await async function(e){e.disableStorage||await e.write(e.tokens)}(n),r}(e,r,s),get:e=>async function(e,n){let o=!1;n.readOnce||(await t(n),o=!0);let s=r(e,n);return s||o?s:(await t(n),r(e,n))}(e,s)}}},390:e=>{const t="tokens";e.exports.read=async function(){return JSON.parse(window.localStorage.getItem(t))},e.exports.write=async function(e){return window.localStorage.setItem(t,JSON.stringify(e))}}},t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{}};return e[n](o,o.exports,r),o.exports}return r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r(223)})();