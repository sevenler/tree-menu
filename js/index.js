String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {    
		if (arguments.length == 1 && typeof (args) == "object") {
			for (var key in args) {
				if(args[key]!=undefined){
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		}
		else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					　　　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
}

function make_menu_item_div(menu_item){
	var submenu = menu_item.submenu;

	var result = "";
	if(submenu == undefined){
		+= "<li class=''><a href='{0}'>{1}</a></li>".format(menu_item.url, menu_item.name);
	}else {
		var sub_result = "";
		for(var i=0; i<submenu.length; i++){
			sub_result += make_menu_item_div(submenu[i]);
		}
		sub_result = "<ul>" + sub_result + "</ul>";
		result += "<li class=''>\
				   <a href='#'>\
				 	  {0} <span class='glyphicon glyphicon-chevron-up'></span> \
		           </a>\
	               {1}\
				   </li>"
			.format(menu_item.name, sub_result);
	}
	return result;
}

function make_menu_div(menu_data, selected_menu){
	menu_text = "";
    for(var i=0; i< menu_data.length; i++){
    	menu_text += make_menu_item_div(menu_data[i]);
    }
  
    menu_text = "<ul>" + menu_text + "</ul>";
    $('.menu-container').html(menu_text);
}

MENU_DATA = [
{
	"name": "name1",
	"url": "www.baidu.com",
	"sort": 0
},
{
	"name": "name2",
	"sort": 1,
	"submenu":[
	{
		"name": "name2-name0",
		"sort": 0,
		"submenu":
			[
			{
				"name": "name2-name0-name0",
				"url": "www.36kr.com",
				"sort": 0
			},
			{
				"name": "name2-name0-name1",
				"url": "www.36kr.com",
				"sort": 1
			}
			]
	}
	]
}
]

$(function() {
	make_menu_div(MENU_DATA);

	var classes = {
		ACTIVE: 'active',
		COLLAPSE_ICON: 'glyphicon-chevron-up',
		EXPAND_ICON: 'glyphicon-chevron-down',
		GLYPHICON: 'glyphicon',
		MENU_CONTAINER: 'menu-container'
	},
	selectors = {},
	config = {
		animationSpeed: 'fast'  
	};

	for (var className in classes) {
		selectors[className] = '.' + classes[className];
	}

	function slideDown($icon) {
		$icon.removeClass(classes.EXPAND_ICON).
			addClass(classes.COLLAPSE_ICON);
		$icon.parent().next().slideDown(config.animationSpeed);
	}

	function slideUp($icon) {
		$icon.removeClass(classes.COLLAPSE_ICON).
			addClass(classes.EXPAND_ICON);
		$icon.parent().next().slideUp(config.animationSpeed);
	}

	function scrollActiveMenuItemIntoView() {
		var $active = $(selectors.MENU_CONTAINER + ' ' + selectors.ACTIVE);

		$(selectors.MENU_CONTAINER).animate({
			scrollTop: $active.offset().top
		});
	}

	// toggle expand/collapse of menu item on icon click
	item_span = $(selectors.MENU_CONTAINER).find(selectors.COLLAPSE_ICON + ',' + selectors.EXPAND_ICON);
	item = item_span.parent();
	item.click(function (ev) {
		ev.preventDefault();

		var $icon = $(this).find(selectors.COLLAPSE_ICON + ',' + selectors.EXPAND_ICON) 
			if ($icon.hasClass(classes.COLLAPSE_ICON)) {
				slideUp($icon);
			} else if ($icon.hasClass(classes.EXPAND_ICON)) {
				slideDown($icon);
			}
	});

	// collapse all menu items on page load
	$(selectors.MENU_CONTAINER + ' ' + selectors.COLLAPSE_ICON).each(function (index) {
		slideUp($(this));
	});

	// expands the active menu item and any parents of the active menu item
	function expandMenuItems() {
		function expandMenuItemsHelper($li) {
			var $collapsedIcon = $li.children().find(selectors.GLYPHICON).first();

			if ($collapsedIcon.length) {
				slideDown($collapsedIcon);
			}

			if ($li.parent().closest('li').length) {
				expandMenuItemsHelper($li.parent().closest('li').first());
			}
		}

		expandMenuItemsHelper($(selectors.MENU_CONTAINER + ' ' + selectors.ACTIVE));
	}
	expandMenuItems();


	setTimeout(function() {
		$(selectors.MENU_CONTAINER).show();
		scrollActiveMenuItemIntoView();
	}, 200);
});
