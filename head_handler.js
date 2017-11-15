class HeadHandler {
	constructor(hh, lh, th) {
		this.homeHandler = hh;
		this.listHandler = lh;
		this.toolsHandler = th;

		var me = this;
		document.getElementById("home_button").onclick = function() {
			me.toggleDisplay(this, me.homeHandler);
		};
		document.getElementById("list_button").onclick = function() {
			me.toggleDisplay(this, me.listHandler);
		};
		document.getElementById("tools_button").onclick = function() {
			me.toggleDisplay(this, me.toolsHandler);
		};
	}

	toggleDisplay(button, handler) {
		if (button.classList.toggle("active")) {
			handler.open();
		} else {
			handler.close();
		}
	}
}
