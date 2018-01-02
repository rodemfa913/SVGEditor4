/// <reference path="disp_handler.ts" />

class NaviHandler implements DispHandler {
	private cursor: HTMLSpanElement;
	private feOffset: SVGFEOffsetElement;
	private naviStyle: CSSStyleDeclaration;
	private page: SVGRectElement;
	private panX: number;
	private panY: number;
	private viewport: SVGGElement;
	private zoomFactor: number;
	private zoom: number;

	constructor() {
		this.cursor = document.getElementById("cursor") as HTMLSpanElement;
		this.naviStyle = document.getElementById("navi").style;
		this.panX = this.panY = 200;
		this.zoom = 1.0;
		this.zoomFactor = 0;

		let l: Element = document.getElementById("fo");
		this.feOffset = l as SVGFEOffsetElement;
		l = document.getElementById("pg");
		this.page = l as SVGRectElement;
		l = document.getElementById("viewport");
		this.viewport = l as SVGGElement;

		let me = this;
		document.getElementById("zoom_in").onclick =
		document.getElementById("zoom_out").onclick = function() { me.setZoom(this.id); };
		document.getElementById("pan_left").onclick =
		document.getElementById("pan_right").onclick =
		document.getElementById("pan_up").onclick =
		document.getElementById("pan_down").onclick = function() { me.setPan(this.id); };
		document.body.onmousemove = function(evt) { me.showCoords(evt) };
	}

	private setPan(id: string): void {
		switch (id) {
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

	private setTransform(): void {
		let offset = (3 / this.zoom).toString();
		let strokeWidth = (1 / this.zoom).toString();
		let xy = (1 / (2 * this.zoom)).toString();

		this.feOffset.setAttribute("dx", offset);
		this.feOffset.setAttribute("dy", offset);

		this.page.setAttribute("x", xy);
		this.page.setAttribute("y", xy);
		this.page.setAttribute("stroke-width", strokeWidth);

		let transform = "translate(320, 320) scale(" + this.zoom +
			") translate(" + (-this.panX) + ", " + (-this.panY) + ")";
		this.viewport.setAttribute("transform", transform);
	}

	private setZoom(id: string): void {
		if (id === "zoom_in") {
			this.zoomFactor++;
		} else {
			this.zoomFactor--;
		}

		this.zoom = Math.pow(2, this.zoomFactor / 2);
		this.setTransform();
	}

	private showCoords(evt: MouseEvent): void {
		let x = Math.floor(this.panX + (evt.pageX - 320) / this.zoom);
		let y = Math.floor(this.panY + (evt.pageY - 320) / this.zoom);
		this.cursor.innerHTML = x + ", " + y;
	}

	close(): void { this.naviStyle.display = "none"; }
	open(): void { this.naviStyle.display = "inline-block"; }
}