class PropsHandler {
	constructor() {
		this.graphic = null;
		this.properties = null;
		this.PropsBox = document.getElementById("properties");

		var me = this;
		document.getElementById("apply_button").onclick = function() { me.apply(); };
		document.getElementById("close_button").onclick = function() { me.close(); };
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

	close() { this.PropsBox.style.display = "none"; }

	open(g) {
		if (this.PropsBox.style.display !== "none") return;

		this.graphic = g;
		var tag = this.graphic.tagName;
		if (tag === "svg") {
			this.graphic = document.getElementById("pg");
		}

		var props = this.PropsBox.getElementsByTagName("TR");
		for (var i = 0; i < props.length; i++) {
			props[i].style.display = "none";
		}

		this.properties = this.PropsBox.getElementsByClassName(tag);
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

		this.PropsBox.style.display = "initial";
	}
}