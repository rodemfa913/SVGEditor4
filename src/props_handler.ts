class PropsHandler {
	private graphic: SVGElement;
	private properties: NodeListOf<HTMLTableRowElement>;
	private propsPanel: HTMLDivElement;

	constructor() {
		this.propsPanel = document.getElementById("properties") as HTMLDivElement;

		let me = this;
		document.getElementById("apply_button").onclick = function() { me.apply(); };
	}

	private apply(): void {
		for (let i = 0; i < this.properties.length; i++) {
			let input = this.properties[i].getElementsByTagName("TD")[0].firstElementChild as
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
			if (input.id === "bg") {
				this.graphic.setAttribute("fill", input.value);
			} else if (input.id === "body") {
				this.graphic.textContent = input.value;
			} else {
				this.graphic.setAttribute(input.id, input.value);
			}
		}
	}

	close(): void { this.propsPanel.style.display = "none"; }

	open(g: SVGElement): void {
		this.properties = this.propsPanel.getElementsByTagName("TR") as NodeListOf<HTMLTableRowElement>;
		for (let i = 0; i < this.properties.length; i++) {
			this.properties[i].style.display = "none";
		}

		this.graphic = g;
		let tag: string;
		if (this.graphic.id === "g0") {
			tag = "root";
			let gg: Element = document.getElementById("pg");
			this.graphic = gg as SVGElement;
		} else {
			tag = this.graphic.tagName;
		}

		this.properties = this.propsPanel.getElementsByClassName(tag) as NodeListOf<HTMLTableRowElement>;
		for (let j = 0; j < this.properties.length; j++) {
			let p = this.properties[j];
			p.style.display = "table-row";
			let input = p.getElementsByTagName("TD")[0].firstElementChild as
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
			if (input.id === "bg") {
				input.value = this.graphic.getAttribute("fill");
			} else if (input.id === "body") {
				input.id = this.graphic.textContent;
			} else {
				input.value = this.graphic.getAttribute(input.id);
			}
		}

		this.propsPanel.style.display = "block";
	}
}