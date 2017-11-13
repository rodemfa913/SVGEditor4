class ToolsHandler {
	constructor(lh) {
		this.editButton = document.getElementById("edit_button");
		this.listHandler = lh;
		this.propsHandler = new PropsHandler();
		this.toolsButton = document.getElementById("tools_button");
		this.toolsStyle = document.getElementById("tools").style;
		this.typeSelect = document.getElementById("type_select");

		var me = this;
		document.getElementById("add_button").onclick = function() { me.add(); };
		this.editButton.onclick = function() { me.edit(); };
		document.getElementById("remove_button").onclick = function() { me.listHandler.remove(); };
		document.getElementById("back_button").onclick = function() { me.listHandler.moveBack(); };
		document.getElementById("forward_button").onclick = function() { me.listHandler.moveForward(); };
	}

	close() { this.toolsStyle.display = "none"; }
	isOpen() { return this.toolsStyle.display !== "none"; }
	open() { this.toolsStyle.display = "block"; }

	add() {
		var type = this.typeSelect.value;
		var graphic = document.createElementNS("http://www.w3.org/2000/svg", type);
		var attributes = null;

		switch (type) {
		case "circle":
			attributes = { cx: 100, cy: 100, r: 50 };
			break;
		case "ellipse":
			attributes = { cx: 200, cy: 200, rx: 100, ry: 75 };
			break;
		case "path":
			attributes = { d: "M 50 50 l 100 50 c -50 50 20 70 -30 100 h -80 z" };
			break;
		case "rect":
			attributes = { x: 50, y: 50, width: 200, height: 150 };
			break;
		case "text":
			attributes = { x: 10, y: 30, "font-family": "serif", "font-size": 24 };
			graphic.appendChild(document.createTextNode("Testing..."));
		}

		if (attributes !== null) {
			attributes.fill = "gray";
			if (type !== "text") {
				attributes.stroke = "black";
			}
			for (var k in attributes) {
				graphic.setAttribute(k, attributes[k]);
			}
		}

		this.listHandler.add(graphic);
	}

	edit() {
		if (this.propsHandler.isOpen()) {
			this.editButton.className = "";
			this.propsHandler.close();
		} else {
			this.editButton.className = "active";
			this.propsHandler.open(this.listHandler.selection.graphic);
		}
	}
}
