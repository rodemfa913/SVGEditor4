class HomeHandler {
	constructor() {
		this.homeStyle = document.getElementById("home").style;
	}

	close() { this.homeStyle.display = "none"; }
	isOpen() { return this.homeStyle.display !== "none"; }
	open() { this.homeStyle.display = "block"; }
}
