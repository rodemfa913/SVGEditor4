/// <reference path="disp_handler.ts" />
/// <reference path="iter.ts" />

class ListHandler implements DispHandler {
	private counter: number;
	private listStyle: CSSStyleDeclaration;
	private root: Iter;
	private _sel: Iter;

	constructor() {
		this.counter = 1;
		this.listStyle = document.getElementById("list").style;
		this.root = new Iter("0");
		this._sel = new Iter("0");

		let me = this;
		document.getElementById("s0").onclick = function() { me.select(this.id); };
	}

	get selection(): Iter { return this._sel; }

	private addAndWalk(parentItem: HTMLLIElement, graphic: SVGElement): void {
		let item = this.addItem(parentItem, graphic);
		let child = graphic.firstElementChild as SVGElement;
		while (child !== null) {
			this.addAndWalk(item, child);
			child = child.nextElementSibling as SVGElement;
		}
	}

	private addItem(parentItem: HTMLLIElement, graphic: SVGElement): HTMLLIElement {
		graphic.id = "g" + this.counter;

		let ci = parentItem.lastElementChild;
		if (!(ci instanceof HTMLUListElement)) {
			ci = document.createElement("UL");
			parentItem.appendChild(ci);
		}
		let childItems = ci as HTMLUListElement;
		let newItem = document.createElement("LI") as HTMLLIElement;
		childItems.appendChild(newItem);
		newItem.id = "i" + this.counter;

		let me = this;

		let checkbox = document.createElement("INPUT") as HTMLInputElement;
		newItem.appendChild(checkbox);
		checkbox.type = "checkbox";
		checkbox.id = "v" + this.counter;
		checkbox.checked = true;
		checkbox.onchange = function() { me.setDisplay(this as HTMLInputElement); };

		newItem.appendChild(document.createTextNode(" "));

		let span = document.createElement("SPAN");
		newItem.appendChild(span);
		span.id = "s" + this.counter;
		span.onclick = function() { me.select(this.id); };
		span.appendChild(document.createTextNode(graphic.tagName + " " + (this.counter++)));

		return newItem;
	}

	private select(id: string): void {
		this.selection.graphic.removeAttribute("filter");
		this.selection.item.classList.remove("selected");

		this._sel = new Iter(id.substring(1));
		if (this.selection.graphic !== this.root.graphic) {
			this.selection.graphic.setAttribute("filter", "url(#shadow)");
			this.selection.item.classList.add("selected");
		}
	}

	private setDisplay(checkbox: HTMLInputElement): void {
		let id = checkbox.id.substring(1);
		let g: Element = document.getElementById("g" + id);
		let graphic = g as SVGElement;
		if (checkbox.checked) {
			graphic.removeAttribute("display");
		} else {
			graphic.setAttribute("display", "none");
		}
	}

	add(newGraphic: SVGElement): void {
		let parent = this.selection;
		if (!(parent.graphic instanceof SVGGElement)) {
			parent = parent.parent;
		}
		parent.graphic.appendChild(newGraphic);

		this.addItem(parent.item, newGraphic);
	}

	addAll(root: SVGSVGElement): void {
		this.removeAll();

		let child = root.firstElementChild as SVGElement;
		while (child !== null) {
			this.root.graphic.appendChild(child);
			child = root.firstElementChild as SVGElement;
		}

		child = this.root.graphic.firstElementChild as SVGElement;
		while (child !== null) {
			this.addAndWalk(this.root.item, child);
			child = child.nextElementSibling as SVGElement;
		}
	}

	close(): void { this.listStyle.display = "none"; }
	getAll(): SVGSVGElement { return this.root.graphic.cloneNode(true) as SVGSVGElement; }

	/**< 0 for move back; >= 0 for move forward.*/
	move(direction: number): void {
		let parent = this.selection.parent;
		if (parent === null) return;

		let previous: Iter, next: Iter;
		if (direction < 0) {
			next = this.selection;
			previous = next.previous;
			if (previous === null) return;
		} else {
			previous = this.selection;
			next = previous.next;
			if (next === null) return;
		}

		parent.graphic.insertBefore(next.graphic, previous.graphic);
		parent.item.lastElementChild.insertBefore(next.item, previous.item);
	}

	open(): void { this.listStyle.display = "block"; }

	remove(): void {
		let parent = this.selection.parent;
		if (parent === null) return;

		let graphic = this.selection.graphic;
		let item = this.selection.item;
		this.selectRoot();

		parent.graphic.removeChild(graphic);
		parent.item.lastElementChild.removeChild(item);
	}

	removeAll(): void {
		this.selectRoot();

		let rootGraphic = this.root.graphic as SVGSVGElement;
		let rootItem = this.root.item.lastElementChild;
		let child = rootGraphic.firstElementChild as SVGElement;
		while (child !== null) {
			rootGraphic.removeChild(child);
			rootItem.removeChild(rootItem.firstElementChild);
			child = rootGraphic.firstElementChild as SVGElement;
		}

		this.counter = 1;
	}

	selectRoot(): void { this.select("s" + this.root.item.id.substring(1)); }
}