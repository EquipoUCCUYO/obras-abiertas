"use strict";angular.module("obrasMduytApp",["ngRoute","ngSanitize","slugifier","slick","leaflet-directive"]).config(["$routeProvider",function(a){a.when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl",controllerAs:"home"}).when("/obra/:id",{templateUrl:"views/obra.html",controller:"ObraCtrl",controllerAs:"obra"}).when("/entorno/:entorno",{templateUrl:"views/entorno.html",controller:"EntornoCtrl",controllerAs:"entorno"}).otherwise({redirectTo:"/home"})}]).service("DataService",["$http","$q","Slug",function(a,b,c){var d,e=function(a){return a.entorno_slug=a.entorno?c.slugify(a.entorno):null,a.tipo=a.tipo?a.tipo.split("|"):[],a.comuna=a.comuna?a.comuna.split("|"):[],a.barrio=a.barrio?a.barrio.split("|"):[],a.licitacion_oferta_empresas=a.licitacion_oferta_empresas?a.licitacion_oferta_empresas.split("|"):[],a.id=parseInt(a.id),a.licitacion_anio=a.licitacion_anio?parseInt(a.licitacion_anio):null,a.monto_contrato=a.monto_contrato?parseFloat(a.monto_contrato):null,a.licitacion_presupuesto_oficial=a.licitacion_presupuesto_oficial?parseFloat(a.licitacion_presupuesto_oficial):null,a.plazo_meses=a.plazo_meses?parseInt(a.plazo_meses):null,a.porcentaje_avance=a.porcentaje_avance?parseFloat(a.porcentaje_avance):null,a},f=function(){return window.MDUYT_CONFIG||(console.error("Archivo de configuración inexistente, utilizando configuración default de desarrollo."),window.MDUYT_CONFIG={BASE_URL:"http://api.topranking.link/",HOME_CSV:"https://goo.gl/vcb6oX"}),window.MDUYT_CONFIG.BASE_URL+"?source_format=csv&source="+window.MDUYT_CONFIG.HOME_CSV+"&callback=JSON_CALLBACK"};this.getById=function(a){var c,d=b.defer();return this.retrieveAll().then(function(b){c=b.filter(function(b){return b.id===parseInt(a)}),d.resolve(c[0])}),c=d.promise,b.when(c)},this.getByEntorno=function(a){var c,d=b.defer();return this.retrieveAll().then(function(b){c=b.filter(function(b){return b.entorno_slug===a}),d.resolve(c)}),c=d.promise,b.when(c)},this.getAll=function(){var a,c=b.defer();return this.retrieveAll().then(function(a){c.resolve(a)}),a=c.promise,b.when(a)},this.retrieveAll=function(){if(!d){var c=b.defer();a.jsonp(f()).then(function(a){d=a.data.map(e),c.resolve(d)},function(a){d=a,c.reject(a)}),d=c.promise}return b.when(d)}}]).run(function(){}),angular.module("obrasMduytApp").controller("HomeCtrl",["$scope","DataService",function(a,b){function c(){v.w=u.select("#home-chart-container").node().getBoundingClientRect().width,v.w=!v.svg||v.w<500?v.w-15:v.w,a.isSmallDevice=v.w<500?!0:!1,a.isSmallDevice?(v.h=v.w,v.margin=v.w/100):(v.h=3*v.w/4,v.margin=v.w/200),v.svg||(v.svg=u.select("#home-chart-container").append("svg"),v.mainGroup=v.svg.append("g").classed("main-group",!0),v.mainGroup.append("rect").attr("fill","white"),v.svg.append("g").attr("id","comunas-group"),v.svg.append("g").attr("id","map-group"),v.svg.append("g").attr("id","etapas-group"),w.group=v.svg.append("g").attr("id","bubbles-group")),v.svg.attr("width",v.w).attr("height",v.h),v.mainGroup.select("rect").attr("width",v.w).attr("height",v.h),a.showGroup(a.selectedGroup)}function d(a,b,c){var d=Math.floor(v.w/b),e=0,f=0;a.transition().duration(700).attr("transform",function(g,h){var i=e*b,j=f*c;return d-1>e?e++:a[0].length!==h+1&&(e=0,f++),"translate("+i+","+j+")"})}function e(){function b(){a.isSmallDevice&&v.svg.attr("height",v.w),v.mapGroup.selectAll("path.map-item").style("display","block").style("stroke-width",0).transition().duration(1e3).style("stroke-width",3).attr("d",v.mapPath).style("opacity",1)}v.mapProjection=u.geo.mercator().center([-58.43992,-34.618]).translate([v.w/2,v.h/2]).scale(190*v.w),v.mapPath=u.geo.path().projection(v.mapProjection),v.mapGroup?b():(v.mapGroup=v.svg.select("#map-group"),u.json("geo/comunas.simple.geojson",function(a){v.mapFeatures=a.features,v.mapGroup.selectAll("path.map-item").data(v.mapFeatures).enter().append("path").classed("child",!0).classed("map-item",!0).attr("id",function(a){return a.id}).classed("shape",!0).on("click",g),b()}))}function f(){w.clusters={},w.clusterPoints={},w.nodes=a.obras.filter(function(a){return a.lat&&a.lng}).map(function(a){var b="i"+a.id,c=5,d={cluster:b,radius:c,data:a};w.clusters[b]=d;var e=(-1*(Math.random()*(34.50001-34.70001)+34.70001).toFixed(5),-1*(Math.random()*(58.30001-58.50001)+58.50001).toFixed(5),v.mapProjection([parseFloat(a.lng),parseFloat(a.lat)]));return w.clusterPoints[b]={x:e[0],y:e[1],radius:5},d})}function g(a){if(B.node()===this)return h();B.classed("active",!1),B=u.select(this).classed("active",!0);var b=v.mapPath.bounds(a),c=b[1][0]-b[0][0],d=b[1][1]-b[0][1],e=(b[0][0]+b[1][0])/2,f=(b[0][1]+b[1][1])/2,g=.9/Math.max(c/v.w,d/v.h),i=[v.w/2-g*e,v.h/2-g*f];v.mapGroup.transition().duration(750).attr("transform","translate("+i+")scale("+g+")"),v.mapGroup.selectAll("path").transition().duration(750).style("stroke-width","1px"),w.group.transition().duration(750).attr("transform","translate("+i+")scale("+g+")")}function h(){B.classed("active",!1),B=u.select(null),v.mapGroup.transition().duration(750).attr("transform",""),v.mapGroup.selectAll("path").transition().duration(750).style("stroke-width","3px"),w.group.transition().duration(750).attr("transform","")}function i(b){var c,e,f=u.range(1,16);a.isSmallDevice?(c=v.w,e=v.w,v.svg.attr("height",f.length*v.w),v.mainGroup.select("rect").attr("height",f.length*v.w)):(c=v.h/3,e=v.w/5),v.comunasGroup||(v.comunasGroup=v.svg.select("#comunas-group"),v.comunasGroup.selectAll("g.comunas-item").data(f).enter().append("g").classed("child",!0).classed("comunas-item",!0).style("opacity",0).attr("transform",function(a,b){return"translate("+(v.w/2-e/2)+","+(v.h/2-c/2)+")"}).attr("id",function(a){return"comunas-item-"+a}).each(function(){var a=u.select(this);a.append("rect").classed("comunas-item-frame",!0).on("click",k),a.append("text").classed("comunas-item-text",!0).attr("fill","#000").text(function(a){return"Comuna "+a})})),b||v.comunasGroup.selectAll("g.comunas-item").style("display","block"),v.comunasGroup.selectAll("rect.comunas-item-frame").transition().duration(700).attr("x",v.margin).attr("y",v.margin).attr("height",c-2*v.margin).attr("width",e-2*v.margin),v.comunasGroup.selectAll("text.comunas-item-text").transition().duration(700).attr("x",15).attr("y",25),d(v.comunasGroup.selectAll("g.comunas-item").transition().duration(1e3).style("opacity",1),e,c)}function j(b){w.clusters={},w.clusterPoints={};var c=b?b.replace("comunas-item-",""):!1;w.nodes=a.obras.filter(function(a){return a.comuna[0]&&(!c||c&&a.comuna[0]===c)}).map(function(a){var b="c"+a.comuna[0],c=10,d={cluster:b,radius:c,data:a};return(!w.clusters[b]||c>w.clusters[b].radius)&&(w.clusters[b]=d),d}),u.selectAll("g.comunas-item").each(function(a){var b=u.select(this),c=b.select("rect");w.clusterPoints["c"+a]={x:u.transform(b.attr("transform")).translate[0]+c.attr("width")/2,y:u.transform(b.attr("transform")).translate[1]+c.attr("height")/2,radius:10}})}function k(a){if(C.node()===this)return l();C.classed("active",!1),C=u.select(this).classed("active",!0);var b=C.node().parentNode;u.selectAll("g.comunas-item").transition().style("opacity",function(){return this===b?1:0}).each("end",function(){this!==b&&u.select(this).style("display","none")}),C.transition().duration(750).attr("height",v.h-2*v.margin).attr("width",v.w-2*v.margin),u.select(b).transition().duration(750).attr("transform","translate(0,0)").each("end",function(){j(u.select(b).attr("id")),q()})}function l(a){C.classed("active",!1),C=u.select(null),u.selectAll("g.comunas-item").style("display","block"),i(a),a||setTimeout(function(){j(),q()},2e3)}function m(b){var c,e,f=u.range(1,5);a.isSmallDevice?(c=v.w,e=v.w,v.svg.attr("height",f.length*v.w),v.mainGroup.select("rect").attr("height",f.length*v.w)):(c=v.h/2,e=v.w/2),v.etapasGroup||(v.etapasGroup=v.svg.select("#etapas-group"),v.etapasGroup.selectAll("g.etapas-item").data(f).enter().append("g").classed("child",!0).classed("etapas-item",!0).style("opacity",0).attr("transform",function(a,b){return"translate("+(v.w/2-e/2)+","+(v.h/2-c/2)+")"}).attr("id",function(a){return"etapas-item-"+a}).each(function(){var a=u.select(this);a.append("rect").classed("etapas-item-frame",!0).on("click",o),a.append("text").classed("etapas-item-text",!0).attr("fill","#000").text(function(a){return"Etapa "+a})})),b||v.etapasGroup.selectAll("g.etapas-item").style("display","block"),v.etapasGroup.selectAll("rect.etapas-item-frame").transition().duration(700).attr("x",v.margin).attr("y",v.margin).attr("height",c-2*v.margin).attr("width",e-2*v.margin),v.etapasGroup.selectAll("text.etapas-item-text").transition().duration(700).attr("x",15).attr("y",25),d(v.etapasGroup.selectAll("g.etapas-item").transition().duration(1e3).style("opacity",1),e,c)}function n(b){w.clusters={},w.clusterPoints={};var c=b?b.replace("etapas-item-",""):!1;w.nodes=a.obras.filter(function(a){return a.etapa&&(!c||c&&a.etapa===c)}).map(function(a){var b="e"+(Math.floor(4*Math.random())+1),c=10,d={cluster:b,radius:c,data:a};return(!w.clusters[b]||c>w.clusters[b].radius)&&(w.clusters[b]=d),d}),u.selectAll("g.etapas-item").each(function(a){var b=u.select(this),c=b.select("rect");w.clusterPoints["e"+a]={x:u.transform(b.attr("transform")).translate[0]+c.attr("width")/2,y:u.transform(b.attr("transform")).translate[1]+c.attr("height")/2,radius:10}})}function o(a){if(D.node()===this)return p();D.classed("active",!1),D=u.select(this).classed("active",!0);var b=D.node().parentNode;u.selectAll("g.etapas-item").transition().style("opacity",function(){return this===b?1:0}).each("end",function(){this!==b&&u.select(this).style("display","none")}),D.transition().duration(750).attr("height",v.h-2*v.margin).attr("width",v.w-2*v.margin),u.select(b).transition().duration(750).attr("transform","translate(0,0)").each("end",function(){n(u.select(b).attr("id")),q()})}function p(a){D.classed("active",!1),D=u.select(null),u.selectAll("g.etapas-item").style("display","block"),m(a),a||setTimeout(function(){n(),q()},2e3)}function q(){w.colors=u.scale.category20(),w.force=u.layout.force().nodes(w.nodes).size([v.w,v.h]).gravity(0).charge(1).on("tick",r).start(),w.circles=w.group.selectAll("circle.obra").data(w.nodes),w.circles.enter().append("circle").classed("obra",!0),w.circles.attr("id",function(a){return"e"+a.data.id}).style("fill",function(a){return w.colors(a.data.tipo[0])}),w.circles.transition().style("opacity",1).attr("r",function(a){return a.radius}),w.circles.exit().remove()}function r(a){w.circles.each(s(10*a.alpha*a.alpha)).each(t(.5)).attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y})}function s(a){return function(b){var c=w.clusters[b.cluster],d=1;if(c){c===b&&(w.clusterPoints?(c=w.clusterPoints[b.cluster],c={x:c.x,y:c.y,radius:-c.radius},d=.5*Math.sqrt(b.radius)):(c={x:v.w/2,y:v.h/2,radius:-b.radius},d=.1*Math.sqrt(b.radius)));var e=b.x-c.x,f=b.y-c.y,g=Math.sqrt(e*e+f*f),h=b.radius+c.radius;g!==h&&(g=(g-h)/g*a*d,b.x-=e*=g,b.y-=f*=g,c.x+=e,c.y+=f)}}}function t(a){var b=u.geom.quadtree(w.nodes);return function(c){var d=c.radius+10,e=c.x-d,f=c.x+d,g=c.y-d,h=c.y+d;b.visit(function(b,d,i,j,k){if(b.point&&b.point!==c){var l=c.x-b.point.x,m=c.y-b.point.y,n=Math.sqrt(l*l+m*m),o=c.radius+b.point.radius+5;o>n&&(n=(n-o)/n*a,c.x-=l*=n,c.y-=m*=n,b.point.x+=l,b.point.y+=m)}return d>f||e>j||i>h||g>k})}}var u=window.d3;a.pymChild=new window.pym.Child({polling:1e3});var v={},w={};a.selectedGroup="comunas";var x={comunas:i,etapas:m,map:e},y={comunas:j,etapas:n,map:f},z={comunas:l,etapas:p,map:h},A={comunas:!1,etapas:!1,map:!1};b.getAll().then(function(b){console.log(b),a.obras=b,c(),window.$(window).resize(function(){clearTimeout(a.timeoutId),a.timeoutId=setTimeout(function(){c(),A={comunas:!1,etapas:!1,map:!1}},1e3)})}),a.showGroup=function(b){a.selectedGroup!==b&&(z[a.selectedGroup](!0),v.svg.selectAll(".child").style("opacity",0).style("display","none"),v.svg.selectAll("circle.obra").transition().style("opacity",.5),a.selectedGroup=b),x[b]();var c=A[b]||"map"==b?100:2e3;A[b]=!0,setTimeout(function(){y[b](),q()},c)};var B=u.select(null),C=u.select(null),D=u.select(null)}]),angular.module("obrasMduytApp").controller("ObraCtrl",["$scope","DataService","$routeParams",function(a,b,c){a.pymChild=new window.pym.Child({polling:1e3}),a.pymChild.sendHeight(),a.obraId=c.id;var d={url:"//tiles1.usig.buenosaires.gob.ar/mapcache/tms/1.0.0/amba_con_transporte_3857@GoogleMapsCompatible/{z}/{x}/{y}.png",format:"tms",builder:"tms",baseLayer:!0,options:{maxZoom:18,minZoom:9,attribution:'USIG (<a href="http://www.buenosaires.gob.ar" target="_blank">GCBA</a>), © <a href="http://www.openstreetmap.org/copyright/en" target="_blank">OpenStreetMap</a> (ODbL)',tms:!0}};a.titles=d,angular.extend(a,{markers:{},center:{lat:-34.604,lng:-58.382,zoom:15},tiles:d,defaults:{scrollWheelZoom:!1}}),b.getById(c.id).then(function(b){console.log(b),a.obra=b,angular.extend(a,{markers:{m1:{lat:parseFloat(b.lat),lng:parseFloat(b.lng),focus:!0,message:b.nombre}}})})}]),angular.module("obrasMduytApp").controller("EntornoCtrl",["$scope","DataService","$routeParams",function(a,b,c){a.pymChild=new window.pym.Child({polling:1e3}),a.pymChild.sendHeight(),b.getByEntorno(c.entorno).then(function(b){a.entorno=c.entorno,console.log(b),a.obras=b})}]),angular.module("obrasMduytApp").run(["$templateCache",function(a){a.put("views/entorno.html",'<div class="row"> <div class="col-md-12"> <h1>Entorno: {{entorno}}</h1> <p>Obras: {{obras.length}}</p> <p ng-repeat="obra in obras"> Obra: {{$index+1}} -> {{obra}} </p> </div> </div> <div class="row"> <div class="col-md-12"> <h4>[Galería]</h4> </div> </div> <div class="row"> <div class="col-md-12"> <h4>[Datos]</h4> </div> </div> <div class="row"> <div class="col-md-12"> <h4> Ubicación de Obra </h4> <leaflet lf-center="london" tiles="tiles" markers="markers" defaults="defaults" width="100%" height="350px"></leaflet> </div> </div>'),a.put("views/home.html",'<div class="row"> <div class="col-sm-10"> <div id="home-chart-container"></div> </div> <div class="col-sm-2"> <a class="btn btn-default btn-block" ng-click="showGroup(\'map\')">Mapa</a> <a class="btn btn-default btn-block" ng-click="showGroup(\'comunas\')">Comunas</a> <a class="btn btn-default btn-block" ng-click="showGroup(\'etapas\')">Etapas</a> <p>Cargadas: {{obras.length}} obras</p> <div id="home-chart-container"></div> </div> </div> <div class="row"> <div class="col-md-12"> <h4>[Sankey]</h4> </div> </div>'),a.put("views/obra.html",'<div class="row obra"> <div class="col-md-12"> <h1>Obra {{obra.id}}: {{obra.nombre}}</h1> <div class="row"> <div class="col-md-8"> <slick class=".slider-for" asnavfor=".slider-nav" infinite="true" slides-to-show="1" slides-to-scroll="1"> <div><img src="http://www.eldiariodebuenosaires.com/files/2016/01/Calle.jpg"></div> <div><img src="http://www.eldiariodebuenosaires.com/files/2016/01/Calle.jpg"></div> <div><img src="http://www.eldiariodebuenosaires.com/files/2016/01/Calle.jpg"></div> </slick> <slick class="slider-nav" asnavfor=".slider-nav" infinite="true" dots="true" centermode="true" focusonselect="true" slides-to-show="3" slides-to-scroll="1"> <div><img ng-src="http://www.eldiariodebuenosaires.com/files/2016/01/Calle.jpg"></div> <div><img src="http://www.eldiariodebuenosaires.com/files/2016/01/Calle.jpg"></div> <div><img src="http://www.eldiariodebuenosaires.com/files/2016/01/Calle.jpg"></div> <div><img src="http://www.eldiariodebuenosaires.com/files/2016/01/Calle.jpg"></div> </slick> <p> {{obra.descripcion}} </p> </div> <div class="col-md-4 ficha-tecnica"> <h4> Ficha técnica de Licitación </h4> <div class="etapa"> <p> Tipo de Obra: <strong ng-repeat="tipo in obra.tipo">{{tipo}}</strong> </p> </div> <p> Area Responsable: <strong> {{obra.area_responsable}}</strong></p> <p> Empresas <ul> <li ng-repeat="empresa in obra.licitacion_oferta_empresas"> <strong>{{empresa}} <i class="detalle-frame-icon glyphicon glyphicon-info-sign" data-container="body" title="{{nota}}" data-toggle="popover" data-placement="bottom" data-content="Fuente: {{fuente}}"></i> </strong> </li> </ul> </p> <p> Etapa: <strong>{{obra.etapa}} </strong> </p> <p> Estado </p> <div class="progress"> <div class="progress-bar bg-color-{{obra.slug}}" role="progressbar" ng-style="{ \'width\': obra.porcentaje_avance + \'%\' }"> <div class="progressbar-w" ng-show="!obra.porcentaje_avance"><p></p> </div> <span class="progressbar-w" ng-hide="obra.porcentaje_avance<22 || !obra.porcentaje_avance"> </span> </div> <div class="progress-w" ng-show="obra.porcentaje_avance<22" ng-style="{ \'width\': (100 - obra.porcentaje_avance) + \'%\' }"></div> </div> <p> Plazo total: <strong> {{obra.plazo_meses}} meses </strong> </p> <p> Inicio : {{obra.fecha_inicio}} // Fin : {{obra.fecha_fin_inicial}} </p> <p> Cantidad de Beneficiaros: <strong> {{obra.benficiarios}}</strong> </p> <p> Mano de Obra <strong> {{obra.mano_obra}} </strong> </p> <p> Monto Contrato: <strong> {{obra.monto_contrato | currency}} </strong> </p> <p> Monto Actualizado: <strong> {{obra.licitacion_presupuesto_oficial | currency}} </strong> </p> <p> <a href=""><i class="detalle-frame-icon glyphicon glyphicon glyphicon-download-alt"> </i> Descargar Informe </a> </p> </div> </div> </div> </div> <div class="row"> <div class="col-md-12"> <h4> Ubicación de Obra </h4> <leaflet center="center" tiles="tiles" markers="markers" defaults="defaults" width="100%" height="350px"></leaflet> </div> </div>')}]);