class HeadHandler {
	constructor() {
		this.homeHandler = new HomeHandler();
		this.listHandler = new ListHandler();
		this.naviHandler = new NaviHandler();
		this.toolsHandler = new ToolsHandler(this.listHandler);

		var me = this;
		document.getElementById("home_button").onclick = function() {
			me.toggleDisplay(this, me.homeHandler);
		};
		document.getElementById("list_button").onclick = function() {
			me.toggleDisplay(this, me.listHandler);
		};
		document.getElementById("navi_button").onclick = function() {
			me.toggleDisplay(this, me.naviHandler);
		};
		document.getElementById("tools_button").onclick = function() {
			me.toggleDisplay(this, me.toolsHandler);
		};
	}

	toggleDisplay(button, handler) {
		if (handler.isOpen()) {
			button.className = "";
			handler.close();
		} else {
			button.className = "active";
			handler.open();
		}
	}
}
