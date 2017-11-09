class HomeHandler {
	constructor() {
		this.homeBox = document.getElementById("home");

		var me = this;
		document.getElementById("save_item").onclick = function() { me.save(); };
	}

	open() { this.homeBox.style.display = "initial"; }
	save() { this.homeBox.style.display = "none"; }
}