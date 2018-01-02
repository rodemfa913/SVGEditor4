/// <reference path="head_handler.ts" />
/// <reference path="home_handler.ts" />

class Script {
	static main(): void {
		let list = new ListHandler();
		let navi = new NaviHandler();
		let props = new PropsHandler();
		let home = new HomeHandler(list);
		let tools = new ToolsHandler(list, props);
		let head = new HeadHandler(list, navi, tools);
	}
}
