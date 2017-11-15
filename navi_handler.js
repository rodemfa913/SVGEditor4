class NaviHandler {
	constructor() {
		this.cursor = document.getElementById("cursor");
		this.root = document.getElementById("g0");
		this.feOffset = document.getElementById("fo");
		this.page = document.getElementById("pg");
		this.panX = 200;
		this.panY = 200;
		this.zoom = 1.0;
		this.zoomFactor = 0;

		var me = this;
		document.getElementById("zoom_in").onclick =
		document.getElementById("zoom_out").onclick = function() { me.setZoom(this); };
		document.getElementById("pan_left").onclick =
		document.getElementById("pan_right").onclick =
		document.getElementById("pan_up").onclick =
		document.getElementById("pan_down").onclick = function() { me.setPan(this) };
		document.body.onmousemove = function(evt) { me.showCoords(evt); };
	}

	setPan(button) {
		switch (button.id) {
		case "pan_left":
			this.panX -= 10;
			break;
		case "pan_right":
			this.panX += 10;
			break;
		case "pan_up":
			this.panY -= 10;
			break;
		default:
			this.panY += 10;
		}
		this.setTransform();
	}

	setTransform() {
		var strokeWidth = 1 / this.zoom;
		this.page.setAttribute("x", strokeWidth / 2);
		this.page.setAttribute("y", strokeWidth / 2);
		this.page.setAttribute("stroke-width", strokeWidth);

		var offset = 3 / this.zoom;
		this.feOffset.setAttribute("dx", offset);
		this.feOffset.setAttribute("dy", offset);

		var transform = "translate(320, 320) scale(" + this.zoom +
			") translate(" + (-this.panX) + ", " + (-this.panY) + ")";
		this.root.setAttribute("transform", transform);
	}

	setZoom(button) {
		if (button.id === "zoom_in") {
			this.zoomFactor++;
		} else {
			this.zoomFactor--;
		}
		this.zoom = Math.pow(2, this.zoomFactor / 2);
		this.setTransform();
	}

	showCoords(evt) {
		var x = this.panX + (evt.pageX - 320) / this.zoom;
		var y = this.panY + (evt.pageY - 320) / this.zoom;
		this.cursor.innerHTML = parseInt(x) + ", " + parseInt(y);
	}
}
