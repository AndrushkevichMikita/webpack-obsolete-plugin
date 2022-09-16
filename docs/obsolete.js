"use strict";var e=this&&this.__assign||function(){return e=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var o in n=arguments[t])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e},e.apply(this,arguments)},n=[/Mobile/i],t=[{name:"ie",includes:[/Trident\/[.\w]+.+?rv:((\d+)[.\w]*)/i,/MSIE ((\d+\.\d+)[.\w]*)/i],excludes:n},{name:"edge",includes:[/Edge\/((\d+)[.\w]*)/i],excludes:n},{name:"chrome",includes:[/Chrome\/((\d+)[.\w]*)/i],excludes:n},{name:"safari",includes:[/Version\/((\d+\.\d+)[.\w]*).+Safari/i],excludes:n},{name:"firefox",includes:[/Firefox\/((\d+\.\d+)[.\w]*)/i],excludes:n},{name:"opera",includes:[/OPR\/((\d+)[.\w]*)/i,/Presto\/[.\w]+.+Version\/((\d+\.\d)[.\w]*)/i,/Opera\/((\d+\.\d)[.\w]*)/i],excludes:[/Mobile|Mobi|Tablet/i]},{name:"android",includes:[/wv.+?Chrome\/((\d+)[.\w]*)/i]},{name:"ios_saf",includes:[/(iPad|iPhone).+OS ((\d+_\d+)\w*)/i]},{name:"and_chr",includes:[/Chrome\/((\d+)[.\w]*).+Mobile/i],excludes:[/wv/i]}];window.obsolete=function(n,r){function o(e,n){var t=/\d+/g,r=/\d+/g,o=/^(\d+)(\.\d+)*$/;for([e,n].forEach((function(n){if(!o.test(n))throw new Error("Parameter `version` `".concat(e,"` isn't a semantic version."))}));;){var i=t.exec(e),a=r.exec(n);if(i&&!a)return 0===Number(i[0])?0:1;if(!i&&a)return 0===Number(a[0])?0:-1;if(i&&a){if(Number(i[0])>Number(a[0]))return 1;if(Number(i[0])<Number(a[0]))return-1}if(!i&&!a)return 0}}if(r=e({},r),!n.length)throw new Error("Parameter `browsers` is empty");var i=function(e,n){var r=[];if(t.forEach((function(n){var t;if(!n.excludes||!n.excludes.some((function(n){return n.exec(e)})))for(var o=0;o<n.includes.length;o++)if(t=n.includes[o].exec(e)){r.push({name:n.name,version:t[1].replace(/_/g,"."),primaryVersion:t[2].replace(/_/g,".")});break}})),!r.length)return!1;var i=/(\w+) (([\d.]+)(?:-[\d.]+)?)/,a=n.map((function(e){var n=i.exec({"op_mini all":"op_mini 0","safari TP":"safari 99"}[e]||e);return{name:n[1],version:n[2],primaryVersion:n[3]}})),s={};a.forEach((function(e){s[e.name]?-1===o(e.primaryVersion,s[e.name].primaryVersion)&&(s[e.name]=e):s[e.name]=e}));var d=Object.keys(s).filter((function(e){return r.some((function(n){return n.name===s[e].name}))})).map((function(e){return s[e]}));return!!d.length&&d.some((function(e){return r.some((function(n){return n.name===e.name&&-1!==o(n.primaryVersion,e.primaryVersion)}))}))}(navigator.userAgent,n);if(!i){var a=document.createElement("style");document.head.appendChild(a);var s="anim-obsolete-close ".concat(500,"ms forwards ease-in-out"),d="anim-obsolete-close {to { transform: translateY(-100%) }}";a.textContent="[data-obsolete-init] {\ncolor: #fff;\nbackground: red;\nposition: fixed;\nwidth: 100vw;\npadding: 4px;\nwhite-space: pre;\ntop: 0; left: 0;\ntext-align: center;\n}\n[data-obsolete-init] a {\n  text-decoration: underline;\n  cursor: pointer;\n}\n[data-obsolete-close] {\n-webkit-animation: ".concat(s,";\n-moz-animation: ").concat(s,";\nanimation: ").concat(s,";\n}\n@-webkit-keyframes ").concat(d,"\n@-moz-keyframes ").concat(d,"\n@keyframes ").concat(d);var c=document.createElement("div");c.setAttribute("data-obsolete-init","");var u=!1;if(c.addEventListener("mousemove",(function(){return u=!0}),{passive:!0}),c.addEventListener("click",(function(e){if(u&&(u=!1),e.target instanceof HTMLAnchorElement){if(!e.target.hasAttribute("href")){var t=window.open();t.document.write(n.join("\n")),t.document.body.style.whiteSpace="pre",t.document.body.style.display="flex",t.document.body.style.justifyContent="center",t.document.close()}}else c.setAttribute("data-obsolete-close",""),setTimeout((function(){c.parentElement.removeChild(c),document.head.removeChild(a)}),500)}),{passive:!0}),r.template)c.innerHTML=r.template.replace("{{browsers}}",n.join("\n"));else c.appendChild(document.createElement("div")).textContent="Your browser is not supported",c.appendChild(document.createElement("a")).textContent="Show supported browsers";document.body?document.body.appendChild(c):window.addEventListener("load",(function(){return document.body.appendChild(c)}),{once:!0,passive:!0}),console&&console.error("Not supported browser",{supportedBrowsers:n,userAgent:window.navigator&&window.navigator.userAgent})}return i};