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
		this.page = document.getElementById("pg");
		this.panX = 200;
		this.panY = 300;
		this.viewBox = new ViewBox(-100, -100, 600, 800);
		this.zoom = 1.0;
		this.zoomFactor = 0;

		var me = this;
		document.getElementById("zoom_in").onclick =
		document.getElementById("zoom_out").onclick = function() { me.setZoom(this); };
		document.getElementById("pan_left").onclick =
		document.getElementById("pan_right").onclick =
		document.getElementById("pan_up").onclick =
		document.getElementById("pan_down").onclick = function() { me.setPan(this) };
		this.canvas.onmousemove = function(evt) { me.showCoords(evt); };
	}

	setPan(button) {
		switch (button.id) {
		case "pan_left":
			this.panX += 10;
			break;
		case "pan_right":
			this.panX -= 10;
			break;
		case "pan_up":
			this.panY += 10;
			break;
		default:
			this.panY -= 10;
		}
		this.setViewBox();
	}

	setViewBox() {
		var strokeWidth = 1 / this.zoom;
		this.page.setAttribute("x", strokeWidth / 2);
		this.page.setAttribute("y", strokeWidth / 2);
		this.page.setAttribute("stroke-width", strokeWidth);

		var offset = 3 / this.zoom;
		this.feOffset.setAttribute("dx", offset);
		this.feOffset.setAttribute("dy", offset);

		this.viewBox.width = 600 / this.zoom;
		this.viewBox.height = 800 / this.zoom;
		this.viewBox.x = this.panX - this.viewBox.width / 2;
		this.viewBox.y = this.panY - this.viewBox.height / 2;
		this.canvas.setAttribute("viewBox", this.viewBox.toString());
	}

	setZoom(button) {
		if (button.id === "zoom_in") this.zoomFactor++;
		else this.zoomFactor--;
		this.zoom = Math.pow(2, this.zoomFactor / 2);
		this.setViewBox();
	}

	showCoords(evt) {
		var x = this.viewBox.x + evt.pageX / this.zoom;
		var y = this.viewBox.y + (evt.pageY - 40) / this.zoom;
		this.cursor.innerHTML = parseInt(x) + ", " + parseInt(y);
	}
}