define(["mvc/toolshed/toolshed-model","mvc/toolshed/util"],function(a,b){var c=Backbone.View.extend({el:"#center",defaults:{tool_shed:"https://toolshed.g2.bx.psu.edu/"},initialize:function(b){var c=b.tool_shed.replace(/\//g,"%2f");this.options=_.defaults(this.options||b,this.defaults),this.model=new a.Categories,this.listenTo(this.model,"sync",this.render),this.model.url=this.model.url+"?tool_shed_url="+this.options.tool_shed,this.model.tool_shed=c,this.model.fetch()},render:function(a){this.options=_.extend(this.options,a),this.options.categories=this.model.models,this.options.queue=b.queueLength();var c=this.templateCategoryList;this.$el.html(c(this.options)),$("#center").css("overflow","auto"),this.bindEvents()},bindEvents:function(){var a=this;require(["libs/jquery/jquery-ui"],function(){$("#search_box").autocomplete({source:function(c,d){var e=a.model.tool_shed.replace(/%2f/g,"/"),f=Galaxy.root+"api/tool_shed/search",g={term:c.term,tool_shed_url:e};$.post(f,g,function(a){console.log(a);var c=b.shedParser(a);d(c)})},minLength:3,select:function(b,c){var d=c.item.value,e=(Galaxy.root+"api/tool_shed/repository",{tool_shed_url:a.model.tool_shed,tsr_id:d},"repository/s/"+a.model.tool_shed+"/r/"+d);Backbone.history.navigate(e,{trigger:!0,replace:!0})}})})},reDraw:function(a){this.$el.empty(),this.model.url=this.model.url+"?tool_shed_url="+this.options.tool_shed,this.initialize(a)},templateCategoryList:_.template(['<style type="text/css">',".ui-autocomplete { background-color: #fff; }","li.ui-menu-item { list-style-type: none; }","</style>",'<div class="unified-panel-header" id="panel_header" unselectable="on">','<div class="unified-panel-header-inner" style="layout: inline;">Categories in <%= tool_shed.replace(/%2f/g, "/") %></div>','<div class="unified-panel-header-inner" style="position: absolute; right: 5px; top: 0px;"><a href="#/queue">Repository Queue (<%= queue %>)</a></div>',"</div>",'<div class="unified-panel-body" id="list_categories">','<div id="standard-search" style="height: 2em; margin: 1em;">','<span class="ui-widget" >','<input class="search-box-input" id="search_box" data-shedurl="<%= tool_shed.replace(/%2f/g, "/") %>" name="search" placeholder="Search repositories by name or id" size="60" type="text" />',"</span>","</div>",'<div style="clear: both; margin-top: 1em;">','<table class="grid">','<thead id="grid-table-header">',"<tr>","<th>Name</th>","<th>Description</th>","<th>Repositories</th>","</tr>","</thead>","<% _.each(categories, function(category) { %>","<tr>","<td>",'<a href="#/category/s/<%= tool_shed %>/c/<%= category.get("id") %>"><%= category.get("name") %></a>',"</td>",'<td><%= category.get("description") %></td>','<td><%= category.get("repositories") %></td>',"</tr>","<% }); %>","</table>","</div>","</div>"].join(""))});return{CategoryView:c}});
//# sourceMappingURL=../../../maps/mvc/toolshed/categories-view.js.map