(this.webpackJsonpreactjs=this.webpackJsonpreactjs||[]).push([[6],{417:function(e,t,r){"use strict";r(80),r(435)},418:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(651).Row;t.default=n},644:function(e,t,r){"use strict";r(80),r(653)},645:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==f(e)&&"function"!==typeof e)return{default:e};var t=i();if(t&&t.has(e))return t.get(e);var r={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var a=n?Object.getOwnPropertyDescriptor(e,o):null;a&&(a.get||a.set)?Object.defineProperty(r,o,a):r[o]=e[o]}r.default=e,t&&t.set(e,r);return r}(r(1)),o=c(r(44)),a=c(r(62)),s=r(46);function c(e){return e&&e.__esModule?e:{default:e}}function i(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return i=function(){return e},e}function f(e){return(f="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function u(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function p(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function m(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=b(e);if(t){var o=b(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return h(this,r)}}function h(e,t){return!t||"object"!==f(t)&&"function"!==typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var v=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r},g=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(f,e);var t,r,c,i=y(f);function f(){var e;return p(this,f),(e=i.apply(this,arguments)).state={scale:1,mounted:!1,isImgExist:!0},e.setScale=function(){if(e.avatarChildren&&e.avatarNode){var t=e.avatarChildren.offsetWidth,r=e.avatarNode.offsetWidth;0===t||0===r||e.lastChildrenWidth===t&&e.lastNodeWidth===r||(e.lastChildrenWidth=t,e.lastNodeWidth=r,e.setState({scale:r-8<t?(r-8)/t:1}))}},e.handleImgLoadError=function(){var t=e.props.onError;!1!==(t?t():void 0)&&e.setState({isImgExist:!1})},e.renderAvatar=function(t){var r,s,c=t.getPrefixCls,i=e.props,f=i.prefixCls,p=i.shape,m=i.size,d=i.src,y=i.srcSet,h=i.icon,b=i.className,g=i.alt,x=v(i,["prefixCls","shape","size","src","srcSet","icon","className","alt"]),O=e.state,E=O.isImgExist,j=O.scale,S=(O.mounted,c("avatar",f)),w=(0,o.default)((u(r={},"".concat(S,"-lg"),"large"===m),u(r,"".concat(S,"-sm"),"small"===m),r)),P=(0,o.default)(S,b,w,(u(s={},"".concat(S,"-").concat(p),p),u(s,"".concat(S,"-image"),d&&E),u(s,"".concat(S,"-icon"),h),s)),C="number"===typeof m?{width:m,height:m,lineHeight:"".concat(m,"px"),fontSize:h?m/2:18}:{},_=e.props.children;if(d&&E)_=n.createElement("img",{src:d,srcSet:y,onError:e.handleImgLoadError,alt:g});else if(h)_="string"===typeof h?n.createElement(a.default,{type:h}):h;else{if(e.avatarChildren||1!==j){var N="scale(".concat(j,") translateX(-50%)"),k={msTransform:N,WebkitTransform:N,transform:N},D="number"===typeof m?{lineHeight:"".concat(m,"px")}:{};_=n.createElement("span",{className:"".concat(S,"-string"),ref:function(t){return e.avatarChildren=t},style:l(l({},D),k)},_)}else{_=n.createElement("span",{className:"".concat(S,"-string"),style:{opacity:0},ref:function(t){return e.avatarChildren=t}},_)}}return n.createElement("span",l({},x,{style:l(l({},C),x.style),className:P,ref:function(t){return e.avatarNode=t}}),_)},e}return t=f,(r=[{key:"componentDidMount",value:function(){this.setScale(),this.setState({mounted:!0})}},{key:"componentDidUpdate",value:function(e){this.setScale(),e.src!==this.props.src&&this.setState({isImgExist:!0,scale:1})}},{key:"render",value:function(){return n.createElement(s.ConfigConsumer,null,this.renderAvatar)}}])&&m(t.prototype,r),c&&m(t,c),f}(n.Component);t.default=g,g.defaultProps={shape:"circle",size:"default"}},653:function(e,t,r){},721:function(e,t,r){},722:function(e,t,r){e.exports=r.p+"static/media/401.10ebf918.png"},723:function(e,t,r){e.exports=r.p+"static/media/404.6197a090.png"},724:function(e,t,r){e.exports=r.p+"static/media/500.9a1bd453.png"},743:function(e,t,r){"use strict";r.r(t);r(417);var n=r(418),o=r.n(n),a=(r(165),r(113)),s=r.n(a),c=(r(380),r(381)),i=r.n(c),f=(r(644),r(645)),l=r.n(f),u=r(7),p=r(13),m=r(103),d=r(102),y=(r(721),r(1)),h=r(68),b=r(722),v=r.n(b),g=r(723),x=r.n(g),O=r(724),E=r.n(O),j=function(e){Object(m.a)(r,e);var t=Object(d.a)(r);function r(){return Object(u.a)(this,r),t.apply(this,arguments)}return Object(p.a)(r,[{key:"render",value:function(){var e=[{errorCode:"404",errorImg:x.a,errorDescription:"Sorry, the page you visited does not exist"},{errorCode:"401",errorImg:v.a,errorDescription:"Sorry, you dont have access to this page"},{errorCode:"500",errorImg:E.a,errorDescription:"Sorry, the server is reporting an error"}],t=new URLSearchParams(this.props.match.params.type).get("type"),r=e.find((function(e){return e.errorCode===t}));return null==r&&(r=e[0]),y.createElement(o.a,{style:{marginTop:150}},y.createElement(i.a,{xs:{span:7,offset:1},sm:{span:7,offset:1},md:{span:7,offset:1},lg:{span:10,offset:4},xl:{span:10,offset:4},xxl:{span:10,offset:4}},y.createElement(l.a,{shape:"square",className:"errorAvatar",src:r.errorImg})),y.createElement(i.a,{xs:{span:7,offset:1},sm:{span:7,offset:1},md:{span:7,offset:1},lg:{span:5,offset:1},xl:{span:5,offset:1},xxl:{span:5,offset:1},style:{marginTop:75}},y.createElement(i.a,{xs:{span:24,offset:0},sm:{span:24,offset:0},md:{span:24,offset:0},lg:{span:24,offset:0},xl:{span:24,offset:0},xxl:{span:24,offset:0}},y.createElement("h1",{className:"errorTitle"},r.errorCode)),y.createElement(i.a,{xs:{span:24,offset:0},sm:{span:24,offset:0},md:{span:24,offset:0},lg:{span:24,offset:0},xl:{span:24,offset:0},xxl:{span:24,offset:0}},y.createElement("h5",{className:"errorDescription"}," ",r.errorDescription)),y.createElement(i.a,{xs:{span:24,offset:0},sm:{span:24,offset:0},md:{span:24,offset:0},lg:{span:24,offset:0},xl:{span:24,offset:0},xxl:{span:24,offset:0}},y.createElement(s.a,{type:"primary"},y.createElement(h.b,{to:{pathname:"/"}},"Back to Home")))),y.createElement(i.a,null))}}]),r}(y.Component);t.default=j}}]);