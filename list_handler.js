class ListHandler {
	constructor() {
		this.counter = 1;
		var s = document.getElementById("i0");
		this.selection = { graphic: document.getElementById("g0"), item: s.parentElement };

		var me = this;
		s.onclick = function() { me.select(this); };
	}

	add(newGraphic) {
		var parent = this.selection;
		if (parent.graphic.tagName !== "svg" && parent.graphic.tagName !== "g") {
			parent = this.getParent();
		}

		parent.graphic.appendChild(newGraphic);
		newGraphic.id = "g" + this.counter;

		var childList = parent.item.lastElementChild;
		if (childList.tagName !== "UL") {
			childList = document.createElement("UL");
			parent.item.appendChild(childList);
		}
		var newItem = document.createElement("LI");
		childList.appendChild(newItem);

		var me = this;

		var l = document.createElement("INPUT");
		newItem.appendChild(l);
		l.id = "v" + this.counter;
		l.setAttribute("type", "checkbox");
		l.checked = true;
		l.onchange = function() { me.setDisplay(this); };

		newItem.appendChild(document.createTextNode(" "));

		l = document.createElement("SPAN");
		newItem.appendChild(l);
		l.id = "i" + this.counter;
		l.onclick = function() { me.select(this); };
		l.appendChild(document.createTextNode(newGraphic.tagName + " " + (this.counter++)));
	}

	getParent() {
		return {
			graphic: this.selection.graphic.parentElement,
			item: this.selection.item.parentElement.parentElement
		};
	}

	moveBack() {
		if (this.selection.graphic.id === "g0") return;

		var selection = this.selection.graphic;
		var previous = selection.previousElementSibling;
		if (previous === null || previous.id === "pg") return;
		selection.parentElement.insertBefore(selection, previous);

		selection = this.selection.item;
		previous = selection.previousElementSibling;
		selection.parentElement.insertBefore(selection, previous);
	}

	moveForward() {
		if (this.selection.graphic.id === "g0") return;

		var selection = this.selection.graphic;
		var next = selection.nextElementSibling;
		if (next === null) return;
		selection.parentElement.insertBefore(next, selection);

		selection = this.selection.item;
		var next = selection.nextElementSibling;
		selection.parentElement.insertBefore(next, selection);
	}

	remove() {
		if (this.selection.graphic.id === "g0") return;

		var graphic = this.selection.graphic;
		var item = this.selection.item;
		document.getElementById("i0").onclick();

		graphic.parentElement.removeChild(graphic);
		item.parentElement.removeChild(item);
	}

	select(s) {
		this.selection.graphic.setAttribute("filter", "");
		this.selection.item.className = "";

		var id = s.id.substring(1);
		this.selection.graphic = document.getElementById("g" + id);
		this.selection.item = s.parentElement;
		if (id !== "0") {
			this.selection.graphic.setAttribute("filter", "url(#shadow)");
			this.selection.item.className = "selected";
		}
	}

	setDisplay(checkbox) {
		var id = checkbox.id.substring(1);
		var style = document.getElementById("g" + id).style;
		if (checkbox.checked) {
			style.display = "";
		} else {
			style.display = "none";
		}
	}
}