/// <reference path="list_handler.ts" />
/// <reference path="props_handler.ts" />

class ToolsHandler implements DispHandler {
	private editButton: HTMLButtonElement;
	private listHandler: ListHandler;
	private propsHandler: PropsHandler;
	private toolsStyle: CSSStyleDeclaration;
	private typeSelect: HTMLSelectElement;

	constructor(lh: ListHandler, ph: PropsHandler) {
		this.editButton = document.getElementById("edit_button") as HTMLButtonElement;
		this.listHandler = lh;
		this.propsHandler = ph;
		this.toolsStyle = document.getElementById("tools").style;
		this.typeSelect = document.getElementById("type_select") as HTMLSelectElement;

		let me = this;
		document.getElementById("add_button").onclick = function() { me.add(); };
		this.editButton.onclick = function() { me.edit(); };
		document.getElementById("remove_button").onclick = function() { me.listHandler.remove(); };
		document.getElementById("back_button").onclick = function() { me.listHandler.move(-1); };
		document.getElementById("forward_button").onclick = function() { me.listHandler.move(1); };
	}

	private add(): void {
		let type = this.typeSelect.value;
		let graphic = document.createElementNS("http://www.w3.org/2000/svg", type);
		let attributes: Object = null;

		switch (type) {
		case "circle":
			attributes = { cx: 100, cy: 100, fill: "gray", r: 50, stroke: "black" };
			break;
		case "ellipse":
			attributes = { cx: 200, cy: 200, fill: "gray", rx: 100, ry: 75, stroke: "black" };
			break;
		case "path":
			attributes = { d: "M 50 50 l 100 50 c -50 50 20 70 -30 100 h -80 z",
				fill: "gray", stroke: "black" };
			break;
		case "rect":
			attributes = { fill: "gray", height: 150, stroke: "black", width: 200, x: 50, y: 50 };
			break;
		case "text":
			attributes = { x: 10, fill: "gray", y: 30, "font-family": "serif", "font-size": 24 };
			graphic.appendChild(document.createTextNode("Testing..."));
		}

		if (attributes !== null) for (let k in attributes) {
			graphic.setAttribute(k, attributes[k]);
		}

		this.listHandler.add(graphic);
	}

	private edit(): void {
		if (this.editButton.classList.toggle("active")) {
			this.propsHandler.open(this.listHandler.selection.graphic);
		} else {
			this.propsHandler.close();
		}
	}

	close(): void { this.toolsStyle.display = "none"; }
	open(): void { this.toolsStyle.display = "inline-block"; }
}