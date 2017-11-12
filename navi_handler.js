class ViewBox {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	toString() { return this.x + " " + this.y + " " + this.width + " " + this.height; }
}

class NaviHandler {
	constructor() {
		this.canvas = document.getElementById("g0");
		this.cursor = document.getElementById("cursor");
		this.feOffset = document.getElementById("fo");
		this.naviStyle = document.getElementById("navi").style;
		this.page = document.getElementById("pg");
		this.panX = document.getElementById("pan_x");
		this.panY = document.getElementById("pan_y");
		this.viewBox = new ViewBox(-200, -100, 800, 600);
		this.zoom = 1.0;
		this.zoomFactor = document.getElementById("zoom");

		this.canvas.setAttribute("width", 800);
		this.canvas.setAttribute("height", 600);
		this.canvas.setAttribute("viewBox", this.viewBox.toString());

		var me = this;
		this.zoomFactor.onchange =
		this.panX.onchange =
		this.panY.onchange = function() { me.setViewBox(); };
		this.canvas.onmousemove = function(evt) { me.showCoords(evt); };
	}

	close() { this.naviStyle.display = "none"; }
	isOpen() { return this.naviStyle.display !== "none"; }
	open() { this.naviStyle.display = "inline-block"; }

	setViewBox() {
		this.zoom = Math.pow(2, this.zoomFactor.value / 2);

		var strokeWidth = 1 / this.zoom;
		this.page.setAttribute("x", strokeWidth / 2);
		this.page.setAttribute("y", strokeWidth / 2);
		this.page.setAttribute("stroke-width", strokeWidth);

		var offset = 3 / this.zoom;
		this.feOffset.setAttribute("dx", offset);
		this.feOffset.setAttribute("dy", offset);

		this.viewBox.width = 800 / this.zoom;
		this.viewBox.height = 600 / this.zoom;
		this.viewBox.x = this.panX.value - this.viewBox.width / 2;
		this.viewBox.y = this.panY.value - this.viewBox.height / 2;
		this.canvas.setAttribute("viewBox", this.viewBox.toString());
	}

	showCoords(evt) {
		var x = this.viewBox.x + evt.pageX / this.zoom;
		var y = this.viewBox.y + evt.pageY / this.zoom;
		this.cursor.innerHTML = parseInt(x) + ", " + parseInt(y);
	}
}
