class HeadHandler {
	constructor() {
		this.canvas = document.getElementById("g0");
		this.cursor = document.getElementById("cursor");
		this.feOffset = document.getElementById("fo");
		this.homeHandler = new HomeHandler();
		this.listHandler = new ListHandler();
		this.page = document.getElementById("pg");
		this.panX = document.getElementById("pan_x");
		this.panY = document.getElementById("pan_y");
		this.propsHandler = new PropsHandler();
		this.typeSelect = document.getElementById("type_select");
		this.viewBox = { x: -200, y: -100, width: 800, height: 600 };
		this.zoom = 1.0;
		this.zoomFactor = document.getElementById("zoom");

		var me = this;
		document.getElementById("home_button").onclick = function() { me.showHome() };
		//document.getElementById("save_button").onclick = function() { me.save(); };
		document.getElementById("add_button").onclick = function() { me.add(); };
		document.getElementById("edit_button").onclick = function() { me.edit(); };
		document.getElementById("remove_button").onclick = function() { me.remove(); };
		document.getElementById("back_button").onclick = function() { me.moveBack(); };
		document.getElementById("forward_button").onclick = function() { me.moveForward(); };
		this.zoomFactor.onchange =
		this.panX.onchange =
		this.panY.onchange = function() { me.setViewBox(); };
		this.canvas.onmousemove = function(evt) { me.showCoords(evt); };
	}

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

	edit() { this.propsHandler.open(this.listHandler.selection.graphic); }
	moveBack() { this.listHandler.moveBack(); }
	moveForward() { this.listHandler.moveForward(); }
	remove() { this.listHandler.remove(); }
	//save() { console.log("Save button clicked."); }

	setViewBox() {
		this.zoom = Math.pow(2, this.zoomFactor.value / 2);

		var strokeWidth = 1 / this.zoom;
		this.page.setAttribute("x", strokeWidth / 2);
		this.page.setAttribute("y", strokeWidth / 2);
		this.page.setAttribute("stroke-width", strokeWidth);
		this.feOffset.setAttribute("dx", 3 / this.zoom);
		this.feOffset.setAttribute("dy", 3 / this.zoom);

		this.viewBox.width = 800 / this.zoom;
		this.viewBox.height = 600 / this.zoom;
		this.viewBox.x = this.panX.value - this.viewBox.width / 2;
		this.viewBox.y = this.panY.value - this.viewBox.height / 2;
		this.canvas.setAttribute(
			"viewBox",
			this.viewBox.x + " " + this.viewBox.y +	" " + this.viewBox.width + " " + this.viewBox.height
		);
	}

	showHome() { this.homeHandler.open(); }

	showCoords(evt) {
		var x = this.viewBox.x + evt.offsetX / this.zoom;
		var y = this.viewBox.y + evt.offsetY / this.zoom;
		this.cursor.innerHTML = parseInt(x) + ", " + parseInt(y);
	}
}