class Iter {
	readonly graphic: SVGElement;
	readonly item: HTMLLIElement;

	constructor(id: string) {
		let g: Element = document.getElementById("g" + id);
		this.graphic = g as SVGElement;
		this.item = document.getElementById("i" + id) as HTMLLIElement;
	}

	get first(): Iter {
		let first = this.graphic.firstElementChild;
		if (first === null) return null;
		return new Iter(first.id.substring(1));
	}

	get next(): Iter {
		if (this.graphic.id === "g0") return null;
		let next = this.graphic.nextElementSibling;
		if (next === null) return null;
		return new Iter(next.id.substring(1));
	}

	get parent(): Iter {
		if (this.graphic.id === "g0") return null;
		return new Iter(this.graphic.parentElement.id.substring(1));
	}

	get previous(): Iter {
		if (this.graphic.id === "g0") return null;
		let previous = this.graphic.previousElementSibling;
		if (previous === null) return null;
		return new Iter(previous.id.substring(1));
	}
}