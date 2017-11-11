class HeadHandler {
	constructor() {
		this.homeHandler = new HomeHandler();
		this.listHandler = new ListHandler();
		this.naviHandler = new NaviHandler();
		this.toolsHandler = new ToolsHandler(this.listHandler);

		var me = this;
		document.getElementById("home_button").onclick = function() { me.toggleDisplay(me.homeHandler); };
		document.getElementById("list_button").onclick = function() { me.toggleDisplay(me.listHandler); };
		document.getElementById("navi_button").onclick = function() { me.toggleDisplay(me.naviHandler); };
		document.getElementById("tools_button").onclick = function() { me.toggleDisplay(me.toolsHandler); };
	}

	toggleDisplay(handler) {
		if (handler.isOpen()) {
			handler.close();
		} else {
			handler.open();
		}
	}
}
