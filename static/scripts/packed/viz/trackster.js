var ui=null;var view=null;var browser_router=null;require(["utils/utils","libs/jquery/jquery.event.drag","libs/jquery/jquery.event.hover","libs/jquery/jquery.mousewheel","libs/jquery/jquery-ui","libs/jquery/select2","libs/farbtastic","libs/jquery/jquery.form","libs/jquery/jquery.rating","mvc/ui"],function(a){a.cssLoadFile("static/style/jquery.rating.css");a.cssLoadFile("static/style/autocomplete_tagging.css");a.cssLoadFile("static/style/jquery-ui/smoothness/jquery-ui.css");a.cssLoadFile("static/style/library.css");a.cssLoadFile("static/style/trackster.css")});define(["libs/underscore","base","viz/trackster/tracks","viz/visualization"],function(b,e,a,c){var d=e.Base.extend({initialize:function(g){this.baseURL=g},save_viz:function(){Galaxy.modal.show({title:"Saving...",body:"progress"});var g=[];$(".bookmark").each(function(){g.push({position:$(this).children(".position").text(),annotation:$(this).children(".annotation").text()})});var h=(view.overview_drawable?view.overview_drawable.config.get_value("name"):null),j={view:view.to_dict(),viewport:{chrom:view.chrom,start:view.low,end:view.high,overview:h},bookmarks:g};return $.ajax({url:galaxy_config.root+"visualization/save",type:"POST",dataType:"json",data:{id:view.vis_id,title:view.config.get_value("name"),dbkey:view.dbkey,type:"trackster",vis_json:JSON.stringify(j)}}).success(function(k){Galaxy.modal.hide();view.vis_id=k.vis_id;view.has_changes=false;window.history.pushState({},"",k.url+window.location.hash)}).error(function(){Galaxy.modal.show({title:"Could Not Save",body:"Could not save visualization. Please try again later.",buttons:{Cancel:function(){Galaxy.modal.hide()}}})})},createButtonMenu:function(){var g=this,h=create_icon_buttons_menu([{icon_class:"plus-button",title:"Add tracks",on_click:function(){c.select_datasets(galaxy_config.root+"visualization/list_current_history_datasets",galaxy_config.root+"api/datasets",{"f-dbkey":view.dbkey},function(j){b.each(j,function(k){view.add_drawable(a.object_from_template(k,view,view))})})}},{icon_class:"block--plus",title:"Add group",on_click:function(){view.add_drawable(new a.DrawableGroup(view,view,{name:"New Group"}))}},{icon_class:"bookmarks",title:"Bookmarks",on_click:function(){force_right_panel(($("div#right").css("right")=="0px"?"hide":"show"))}},{icon_class:"globe",title:"Circster",on_click:function(){window.location=g.baseURL+"visualization/circster?id="+view.vis_id}},{icon_class:"disk--arrow",title:"Save",on_click:function(){g.save_viz()}},{icon_class:"cross-circle",title:"Close",on_click:function(){g.handle_unsaved_changes(view)}}],{tooltip_config:{placement:"bottom"}});this.buttonMenu=h;return h},add_bookmarks:function(){var g=this,h=this.baseURL;Galaxy.modal.show({title:"Select dataset for new bookmarks",body:"progress"});$.ajax({url:this.baseURL+"/visualization/list_histories",data:{"f-dbkey":view.dbkey},error:function(){alert("Grid failed")},success:function(j){Galaxy.modal.show({title:"Select dataset for new bookmarks",body:j,buttons:{Cancel:function(){Galaxy.modal.hide()},Insert:function(){$("input[name=id]:checked,input[name=ldda_ids]:checked").first().each(function(){var k,l=$(this).val();if($(this).attr("name")==="id"){k={hda_id:l}}else{k={ldda_id:l}}$.ajax({url:this.baseURL+"/visualization/bookmarks_from_dataset",data:k,dataType:"json"}).then(function(m){for(i=0;i<m.data.length;i++){var n=m.data[i];g.add_bookmark(n[0],n[1])}})});Galaxy.modal.hide()}}})}})},add_bookmark:function(l,j,g){var n=$("#right .unified-panel-body"),p=$("<div/>").addClass("bookmark").appendTo(n);var q=$("<div/>").addClass("position").appendTo(p),m=$("<a href=''/>").text(l).appendTo(q).click(function(){view.go_to(l);return false}),k=$("<div/>").text(j).appendTo(p);if(g){var o=$("<div/>").addClass("delete-icon-container").prependTo(p).click(function(){p.slideUp("fast");p.remove();view.has_changes=true;return false}),h=$("<a href=''/>").addClass("icon-button delete").appendTo(o);k.make_text_editable({num_rows:3,use_textarea:true,help_text:"Edit bookmark note"}).addClass("annotation")}view.has_changes=true;return p},create_visualization:function(m,g,l,n,k){var j=this,h=new a.TracksterView(b.extend(m,{header:false}));h.editor=true;$.when(h.load_chroms_deferred).then(function(y){if(g){var w=g.chrom,o=g.start,t=g.end,q=g.overview;if(w&&(o!==undefined)&&t){h.change_chrom(w,o,t)}else{h.change_chrom(y[0].chrom)}}else{h.change_chrom(y[0].chrom)}if(l){var r,p,s;for(var u=0;u<l.length;u++){h.add_drawable(a.object_from_template(l[u],h,h))}}var x;for(var u=0;u<h.drawables.length;u++){if(h.drawables[u].config.get_value("name")===q){h.set_overview(h.drawables[u]);break}}if(n){var v;for(var u=0;u<n.length;u++){v=n[u];j.add_bookmark(v.position,v.annotation,k)}}h.has_changes=false});this.set_up_router({view:h});return h},set_up_router:function(g){new c.TrackBrowserRouter(g);Backbone.history.start()},init_keyboard_nav:function(g){$(document).keyup(function(h){if($(h.srcElement).is(":input")){return}switch(h.which){case 37:g.move_fraction(0.25);break;case 38:var j=Math.round(g.viewport_container.height()/15);g.viewport_container.scrollTop(g.viewport_container.scrollTop()-20);break;case 39:g.move_fraction(-0.25);break;case 40:var j=Math.round(g.viewport_container.height()/15);g.viewport_container.scrollTop(g.viewport_container.scrollTop()+20);break}})},handle_unsaved_changes:function(g){if(g.has_changes){var h=this;Galaxy.modal.show({title:"Close visualization",body:"There are unsaved changes to your visualization which will be lost if you do not save them.",buttons:{Cancel:function(){Galaxy.modal.hide()},"Leave without Saving":function(){$(window).off("beforeunload");window.location=galaxy_config.root+"visualization"},Save:function(){$.when(h.save_viz()).then(function(){window.location=galaxy_config.root+"visualization"})}}})}else{window.location=galaxy_config.root+"visualization"}}});var f=e.Backbone.View.extend({initialize:function(){ui=new d(galaxy_config.root);ui.createButtonMenu();ui.buttonMenu.$el.attr("style","float: right");$("#center .unified-panel-header-inner").append(ui.buttonMenu.$el);$("#right .unified-panel-title").append("Bookmarks");$("#right .unified-panel-icons").append("<a id='add-bookmark-button' class='icon-button menu-button plus-button' href='javascript:void(0);' title='Add bookmark'></a>");$("#right-border").click(function(){view.resize_window()});force_right_panel("hide");if(galaxy_config.app.id){this.view_existing()}else{this.view_new()}},view_existing:function(){var g=galaxy_config.app.viz_config;view=ui.create_visualization({container:$("#center .unified-panel-body"),name:g.title,vis_id:g.vis_id,dbkey:g.dbkey},g.viewport,g.tracks,g.bookmarks,true);this.init_editor()},view_new:function(){var g=this;$.ajax({url:galaxy_config.root+"api/genomes?chrom_info=True",data:{},error:function(){alert("Couldn't create new browser.")},success:function(h){Galaxy.modal.show({title:"New Visualization",body:g.template_view_new(h),buttons:{Cancel:function(){window.location=galaxy_config.root+"visualization/list"},Create:function(){g.create_browser($("#new-title").val(),$("#new-dbkey").val());Galaxy.modal.hide()}}});if(galaxy_config.app.default_dbkey){$("#new-dbkey").val(galaxy_config.app.default_dbkey)}$("#new-title").focus();$("select[name='dbkey']").select2();$("#overlay").css("overflow","auto")}})},template_view_new:function(g){var j='<form id="new-browser-form" action="javascript:void(0);" method="post" onsubmit="return false;"><div class="form-row"><label for="new-title">Browser name:</label><div class="form-row-input"><input type="text" name="title" id="new-title" value="Unnamed"></input></div><div style="clear: both;"></div></div><div class="form-row"><label for="new-dbkey">Reference genome build (dbkey): </label><div class="form-row-input"><select name="dbkey" id="new-dbkey">';for(var h=0;h<g.length;h++){j+='<option value="'+g[h][1]+'">'+g[h][0]+"</option>"}j+='</select></div><div style="clear: both;"></div></div><div class="form-row">Is the build not listed here? <a href="'+galaxy_config.root+'user/dbkeys?use_panels=True">Add a Custom Build</a></div></form>';return j},create_browser:function(h,g){$(document).trigger("convert_to_values");view=ui.create_visualization({container:$("#center .unified-panel-body"),name:h,dbkey:g},galaxy_config.app.gene_region);this.init_editor();view.editor=true},init_editor:function(){$("#center .unified-panel-title").text(view.config.get_value("name")+" ("+view.dbkey+")");if(galaxy_config.app.add_dataset){$.ajax({url:galaxy_config.root+"api/datasets/"+galaxy_config.app.add_dataset,data:{hda_ldda:"hda",data_type:"track_config"},dataType:"json",success:function(g){view.add_drawable(a.object_from_template(g,view,view))}})}$("#add-bookmark-button").click(function(){var h=view.chrom+":"+view.low+"-"+view.high,g="Bookmark description";return ui.add_bookmark(h,g,true)});ui.init_keyboard_nav(view);$(window).on("beforeunload",function(){if(view.has_changes){return"There are unsaved changes to your visualization that will be lost if you leave this page."}})}});return{TracksterUI:d,GalaxyApp:f}});