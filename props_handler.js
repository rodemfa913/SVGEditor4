class PropsHandler {
	constructor() {
		this.graphic = null;
		this.properties = null;
		this.propsBox = document.getElementById("properties");

		var me = this;
		document.getElementById("apply_button").onclick = function() { me.apply(); };
	}

	apply() {
		for (var i = 0; i < this.properties.length; i++) {
			var input = this.properties[i].getElementsByTagName("TD")[0].firstElementChild;
			if (input.id === "bg") { // svg
				this.graphic.setAttribute("fill", input.value);
			} else if (input.id === "body") { // text
				this.graphic.textContent = input.value;
			} else {
				this.graphic.setAttribute(input.id, input.value);
			}
		}
	}

	close() { this.propsBox.style.display = "none"; }
	isOpen() { return this.propsBox.style.display !== "none"; }

	open(g) {
		this.graphic = g;
		var tag = this.graphic.tagName;
		if (tag === "svg") {
			this.graphic = document.getElementById("pg");
		}

		var props = this.propsBox.getElementsByTagName("TR");
		for (var i = 0; i < props.length; i++) {
			props[i].style.display = "none";
		}

		this.properties = this.propsBox.getElementsByClassName(tag);
		for (var j = 0; j < this.properties.length; j++) {
			var p = this.properties[j];
			p.style.display = "table-row";
			var input = p.getElementsByTagName("TD")[0].firstElementChild;
			if (input.id === "bg") { // svg
				input.value = this.graphic.getAttribute("fill");
			} else if (input.id === "body") { // text
				input.value = this.graphic.textContent;
			} else {
				input.value = this.graphic.getAttribute(input.id);
			}
		}

		this.propsBox.style.display = "block";
	}
}
