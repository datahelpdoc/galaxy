define(["mvc/dataset/states","mvc/history/hdca-li","ui/fa-icon-button","utils/localization"],function(a,f,c,b){var d=f.HDCAListItemView;var e=d.extend({_renderPrimaryActions:function(){this.log(this+"._renderPrimaryActions");return d.prototype._renderPrimaryActions.call(this).concat([this._renderDeleteButton()])},_renderDeleteButton:function(){var h=this,g=this.model.get("deleted");return c({title:g?b("Dataset collection is already deleted"):b("Delete"),classes:"delete-btn",faIcon:"fa-times",disabled:g,onclick:function(){h.$el.find(".icon-btn.delete-btn").trigger("mouseout");h.model["delete"]()}})},toString:function(){var g=(this.model)?(this.model+""):("(no model)");return"HDCAListItemEdit("+g+")"}});return{HDCAListItemEdit:e}});