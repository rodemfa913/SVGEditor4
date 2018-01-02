/// <reference path="list_handler.ts" />
/// <reference path="navi_handler.ts" />
/// <reference path="tools_handler.ts" />

class HeadHandler {
	private listHandler: ListHandler;
	private naviHandler: NaviHandler;
	private toolsHandler: ToolsHandler;

	constructor(lh: ListHandler, nh: NaviHandler, th: ToolsHandler) {
		this.listHandler = lh;
		this.naviHandler = nh;
		this.toolsHandler = th;

		let me = this;
		document.getElementById("list_button").onclick = function() {
			me.toggleDisplay(this as HTMLButtonElement, me.listHandler);
		};
		document.getElementById("navi_button").onclick = function() {
			me.toggleDisplay(this as HTMLButtonElement, me.naviHandler);
		};
		document.getElementById("tools_button").onclick = function() {
			me.toggleDisplay(this as HTMLButtonElement, me.toolsHandler);
		};
	}

	private toggleDisplay(button: HTMLButtonElement, handler: DispHandler): void {
		if (button.classList.toggle("active")) {
			handler.open();
		} else {
			handler.close();
		}
	}
}