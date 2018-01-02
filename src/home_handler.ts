/// <reference path="list_handler.ts" />

class HomeHandler {
	private clipArea: HTMLTextAreaElement;
	private clipStyle: CSSStyleDeclaration;
	private lcButton: HTMLButtonElement;
	private listHandler: ListHandler;
	private page: SVGRectElement;
	private prompt: HTMLSpanElement;
	private root: SVGSVGElement;

	constructor(lh: ListHandler) {
		this.clipArea = document.getElementById("cb_area") as HTMLTextAreaElement;
		this.clipStyle = document.getElementById("clipboard").style;
		this.lcButton = document.getElementById("lc_button") as HTMLButtonElement;
		this.listHandler = lh;
		this.prompt = document.getElementById("prompt") as HTMLSpanElement;

		let l: Element = document.getElementById("pg");
		this.page = l as SVGRectElement;
		l = document.getElementById("g0");
		this.root = l as SVGSVGElement;

		let me = this;
		document.getElementById("new_item").onclick = function() { me.neW(); };
		document.getElementById("load_item").onclick = function() { me.open("load"); };
		document.getElementById("save_item").onclick = function() { me.open("save"); };
		this.lcButton.onclick = function() { me.close(); };
	}

	private close(): void {
		if (this.lcButton.innerHTML === "Load") {
			let div = document.createElement("DIV") as HTMLDivElement;
			div.innerHTML = this.clipArea.value;

			let last = div.lastElementChild;
			if (last === null || !(last instanceof SVGSVGElement)) {
				this.clipArea.value = "<!--Bad content. Try again-->";
				return;
			}
			let svg = last as SVGSVGElement;

			this.page.setAttribute("width", svg.getAttribute("width"));
			this.page.setAttribute("height", svg.getAttribute("height"));
			this.page.setAttribute("fill", svg.style.backgroundColor);

			this.listHandler.addAll(svg);
		}

		this.clipStyle.display = "none";
	}

	private neW(): void {
		this.page.setAttribute("width", "400");
		this.page.setAttribute("height", "400");
		this.page.setAttribute("fill", "white");

		this.listHandler.removeAll();
	}

	private open(command: string): void {
		if (command === "load") {
			this.prompt.innerHTML = "Copy and paste the content of your SVG file into this box.";
			this.clipArea.value = '<!--example-->\n<svg width="400" height="400" style="background-color: white;">\n' +
			'  <rect width="100" height="75"/>\n</svg>';
			this.lcButton.innerHTML = "Load";
		} else {
			this.prompt.innerHTML = "Copy and paste the content of this box into your SVG file.";
			this.lcButton.innerHTML = "Close";

			let div = document.createElement("DIV") as HTMLDivElement;

			let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			div.appendChild(svg);
			svg.setAttribute("width", this.page.getAttribute("width"));
			svg.setAttribute("height", this.page.getAttribute("height"));
			svg.style.backgroundColor = this.page.getAttribute("fill");

			this.listHandler.selectRoot();

			let root = this.listHandler.getAll();
			let child = root.firstElementChild as SVGElement;
			while (child !== null) {
				svg.appendChild(child);
				child = root.firstElementChild as SVGElement;
			}

			this.clipArea.value = div.innerHTML;
		}

		this.clipStyle.display = "block";
	}
}
