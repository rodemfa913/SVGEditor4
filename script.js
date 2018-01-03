class Iter {
    constructor(id) {
        let g = document.getElementById("g" + id);
        this.graphic = g;
        this.item = document.getElementById("i" + id);
    }
    get first() {
        let first = this.graphic.firstElementChild;
        if (first === null)
            return null;
        return new Iter(first.id.substring(1));
    }
    get next() {
        if (this.graphic.id === "g0")
            return null;
        let next = this.graphic.nextElementSibling;
        if (next === null)
            return null;
        return new Iter(next.id.substring(1));
    }
    get parent() {
        if (this.graphic.id === "g0")
            return null;
        return new Iter(this.graphic.parentElement.id.substring(1));
    }
    get previous() {
        if (this.graphic.id === "g0")
            return null;
        let previous = this.graphic.previousElementSibling;
        if (previous === null)
            return null;
        return new Iter(previous.id.substring(1));
    }
}
/// <reference path="disp_handler.ts" />
/// <reference path="iter.ts" />
class ListHandler {
    constructor() {
        this.counter = 1;
        this.listStyle = document.getElementById("list").style;
        this.root = new Iter("0");
        this._sel = new Iter("0");
        let me = this;
        document.getElementById("s0").onclick = function () { me.select(this.id); };
    }
    get selection() { return this._sel; }
    addAndWalk(parentItem, graphic) {
        let item = this.addItem(parentItem, graphic);
        let child = graphic.firstElementChild;
        while (child !== null) {
            this.addAndWalk(item, child);
            child = child.nextElementSibling;
        }
    }
    addItem(parentItem, graphic) {
        graphic.id = "g" + this.counter;
        let ci = parentItem.lastElementChild;
        if (!(ci instanceof HTMLUListElement)) {
            ci = document.createElement("UL");
            parentItem.appendChild(ci);
        }
        let childItems = ci;
        let newItem = document.createElement("LI");
        childItems.appendChild(newItem);
        newItem.id = "i" + this.counter;
        let me = this;
        let checkbox = document.createElement("INPUT");
        newItem.appendChild(checkbox);
        checkbox.type = "checkbox";
        checkbox.id = "v" + this.counter;
        checkbox.checked = true;
        checkbox.onchange = function () { me.setDisplay(this); };
        newItem.appendChild(document.createTextNode(" "));
        let span = document.createElement("SPAN");
        newItem.appendChild(span);
        span.id = "s" + this.counter;
        span.onclick = function () { me.select(this.id); };
        span.appendChild(document.createTextNode(graphic.tagName + " " + (this.counter++)));
        return newItem;
    }
    select(id) {
        this.selection.graphic.removeAttribute("filter");
        this.selection.item.classList.remove("selected");
        this._sel = new Iter(id.substring(1));
        if (this.selection.graphic !== this.root.graphic) {
            this.selection.graphic.setAttribute("filter", "url(#shadow)");
            this.selection.item.classList.add("selected");
        }
    }
    setDisplay(checkbox) {
        let id = checkbox.id.substring(1);
        let g = document.getElementById("g" + id);
        let graphic = g;
        if (checkbox.checked) {
            graphic.removeAttribute("display");
        }
        else {
            graphic.setAttribute("display", "none");
        }
    }
    add(newGraphic) {
        let parent = this.selection;
        if (!(parent.graphic instanceof SVGGElement)) {
            parent = parent.parent;
        }
        parent.graphic.appendChild(newGraphic);
        this.addItem(parent.item, newGraphic);
    }
    addAll(root) {
        this.removeAll();
        let child = root.firstElementChild;
        while (child !== null) {
            this.root.graphic.appendChild(child);
            child = root.firstElementChild;
        }
        child = this.root.graphic.firstElementChild;
        while (child !== null) {
            this.addAndWalk(this.root.item, child);
            child = child.nextElementSibling;
        }
    }
    close() { this.listStyle.display = "none"; }
    getAll() { return this.root.graphic.cloneNode(true); }
    /**< 0 for move back; >= 0 for move forward.*/
    move(direction) {
        let parent = this.selection.parent;
        if (parent === null)
            return;
        let previous, next;
        if (direction < 0) {
            next = this.selection;
            previous = next.previous;
            if (previous === null)
                return;
        }
        else {
            previous = this.selection;
            next = previous.next;
            if (next === null)
                return;
        }
        parent.graphic.insertBefore(next.graphic, previous.graphic);
        parent.item.lastElementChild.insertBefore(next.item, previous.item);
    }
    open() { this.listStyle.display = "block"; }
    remove() {
        let parent = this.selection.parent;
        if (parent === null)
            return;
        let graphic = this.selection.graphic;
        let item = this.selection.item;
        this.selectRoot();
        parent.graphic.removeChild(graphic);
        parent.item.lastElementChild.removeChild(item);
    }
    removeAll() {
        this.selectRoot();
        let rootGraphic = this.root.graphic;
        let rootItem = this.root.item.lastElementChild;
        let child = rootGraphic.firstElementChild;
        while (child !== null) {
            rootGraphic.removeChild(child);
            rootItem.removeChild(rootItem.firstElementChild);
            child = rootGraphic.firstElementChild;
        }
        this.counter = 1;
    }
    selectRoot() { this.select("s" + this.root.item.id.substring(1)); }
}
/// <reference path="disp_handler.ts" />
class NaviHandler {
    constructor() {
        this.cursor = document.getElementById("cursor");
        this.naviStyle = document.getElementById("navi").style;
        this.panX = this.panY = 200;
        this.zoom = 1.0;
        this.zoomFactor = 0;
        let l = document.getElementById("fo");
        this.feOffset = l;
        l = document.getElementById("pg");
        this.page = l;
        l = document.getElementById("viewport");
        this.viewport = l;
        let me = this;
        document.getElementById("zoom_in").onclick =
            document.getElementById("zoom_out").onclick = function () { me.setZoom(this.id); };
        document.getElementById("pan_left").onclick =
            document.getElementById("pan_right").onclick =
                document.getElementById("pan_up").onclick =
                    document.getElementById("pan_down").onclick = function () { me.setPan(this.id); };
        document.body.onmousemove = function (evt) { me.showCoords(evt); };
    }
    setPan(id) {
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
    setTransform() {
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
    setZoom(id) {
        if (id === "zoom_in") {
            this.zoomFactor++;
        }
        else {
            this.zoomFactor--;
        }
        this.zoom = Math.pow(2, this.zoomFactor / 2);
        this.setTransform();
    }
    showCoords(evt) {
        let x = Math.floor(this.panX + (evt.pageX - 320) / this.zoom);
        let y = Math.floor(this.panY + (evt.pageY - 320) / this.zoom);
        this.cursor.innerHTML = x + ", " + y;
    }
    close() { this.naviStyle.display = "none"; }
    open() { this.naviStyle.display = "inline-block"; }
}
class PropsHandler {
    constructor() {
        this.propsPanel = document.getElementById("properties");
        let me = this;
        document.getElementById("apply_button").onclick = function () { me.apply(); };
    }
    apply() {
        for (let i = 0; i < this.properties.length; i++) {
            let input = this.properties[i].getElementsByTagName("TD")[0].firstElementChild;
            if (input.id === "bg") {
                this.graphic.setAttribute("fill", input.value);
            }
            else if (input.id === "body") {
                this.graphic.textContent = input.value;
            }
            else {
                this.graphic.setAttribute(input.id, input.value);
            }
        }
    }
    close() { this.propsPanel.style.display = "none"; }
    open(g) {
        this.properties = this.propsPanel.getElementsByTagName("TR");
        for (let i = 0; i < this.properties.length; i++) {
            this.properties[i].style.display = "none";
        }
        this.graphic = g;
        let tag;
        if (this.graphic.id === "g0") {
            tag = "root";
            let gg = document.getElementById("pg");
            this.graphic = gg;
        }
        else {
            tag = this.graphic.tagName;
        }
        this.properties = this.propsPanel.getElementsByClassName(tag);
        for (let j = 0; j < this.properties.length; j++) {
            let p = this.properties[j];
            p.style.display = "table-row";
            let input = p.getElementsByTagName("TD")[0].firstElementChild;
            if (input.id === "bg") {
                input.value = this.graphic.getAttribute("fill");
            }
            else if (input.id === "body") {
                input.id = this.graphic.textContent;
            }
            else {
                input.value = this.graphic.getAttribute(input.id);
            }
        }
        this.propsPanel.style.display = "block";
    }
}
/// <reference path="list_handler.ts" />
/// <reference path="props_handler.ts" />
class ToolsHandler {
    constructor(lh, ph) {
        this.editButton = document.getElementById("edit_button");
        this.listHandler = lh;
        this.propsHandler = ph;
        this.toolsStyle = document.getElementById("tools").style;
        this.typeSelect = document.getElementById("type_select");
        let me = this;
        document.getElementById("add_button").onclick = function () { me.add(); };
        this.editButton.onclick = function () { me.edit(); };
        document.getElementById("remove_button").onclick = function () { me.listHandler.remove(); };
        document.getElementById("back_button").onclick = function () { me.listHandler.move(-1); };
        document.getElementById("forward_button").onclick = function () { me.listHandler.move(1); };
    }
    add() {
        let type = this.typeSelect.value;
        let graphic = document.createElementNS("http://www.w3.org/2000/svg", type);
        let attributes = null;
        switch (type) {
            case "circle":
                attributes = { cx: 100, cy: 100, fill: "gray", r: 50, stroke: "black" };
                break;
            case "ellipse":
                attributes = { cx: 200, cy: 200, fill: "gray", rx: 100, ry: 75, stroke: "black" };
                break;
            case "path":
                attributes = { d: "M 50 50 l 100 50 c -50 50 20 70 -30 100 h -80 z",
                    fill: "gray", stroke: "black" };
                break;
            case "rect":
                attributes = { fill: "gray", height: 150, stroke: "black", width: 200, x: 50, y: 50 };
                break;
            case "text":
                attributes = { x: 10, fill: "gray", y: 30, "font-family": "serif", "font-size": 24 };
                graphic.appendChild(document.createTextNode("Testing..."));
        }
        if (attributes !== null)
            for (let k in attributes) {
                graphic.setAttribute(k, attributes[k]);
            }
        this.listHandler.add(graphic);
    }
    edit() {
        if (this.editButton.classList.toggle("active")) {
            this.propsHandler.open(this.listHandler.selection.graphic);
        }
        else {
            this.propsHandler.close();
        }
    }
    close() { this.toolsStyle.display = "none"; }
    open() { this.toolsStyle.display = "inline-block"; }
}
/// <reference path="list_handler.ts" />
/// <reference path="navi_handler.ts" />
/// <reference path="tools_handler.ts" />
class HeadHandler {
    constructor(lh, nh, th) {
        this.listHandler = lh;
        this.naviHandler = nh;
        this.toolsHandler = th;
        let me = this;
        document.getElementById("list_button").onclick = function () {
            me.toggleDisplay(this, me.listHandler);
        };
        document.getElementById("navi_button").onclick = function () {
            me.toggleDisplay(this, me.naviHandler);
        };
        document.getElementById("tools_button").onclick = function () {
            me.toggleDisplay(this, me.toolsHandler);
        };
    }
    toggleDisplay(button, handler) {
        if (button.classList.toggle("active")) {
            handler.open();
        }
        else {
            handler.close();
        }
    }
}
/// <reference path="list_handler.ts" />
class HomeHandler {
    constructor(lh) {
        this.clipArea = document.getElementById("cb_area");
        this.clipStyle = document.getElementById("clipboard").style;
        this.closeButton = document.getElementById("close_button");
        this.listHandler = lh;
        this.loadButton = document.getElementById("load_button");
        this.prompt = document.getElementById("prompt");
        let l = document.getElementById("pg");
        this.page = l;
        l = document.getElementById("g0");
        this.root = l;
        let me = this;
        document.getElementById("new_item").onclick = function () { me.neW(); };
        document.getElementById("load_item").onclick = function () { me.open("load"); };
        document.getElementById("save_item").onclick = function () { me.open("save"); };
        this.loadButton.onclick = function () { me.load(); };
        this.closeButton.onclick = function () { me.close(); };
    }
    close() { this.clipStyle.display = "none"; }
    load() {
        let div = document.createElement("DIV");
        div.innerHTML = this.clipArea.value;
        let last = div.lastElementChild;
        if (last === null || !(last instanceof SVGSVGElement)) {
            this.clipArea.value = "<!--Bad content. Try again-->";
            return;
        }
        let svg = last;
        this.page.setAttribute("width", svg.getAttribute("width"));
        this.page.setAttribute("height", svg.getAttribute("height"));
        this.page.setAttribute("fill", svg.style.backgroundColor);
        this.listHandler.addAll(svg);
    }
    neW() {
        this.page.setAttribute("width", "400");
        this.page.setAttribute("height", "400");
        this.page.setAttribute("fill", "white");
        this.listHandler.removeAll();
    }
    open(command) {
        if (command === "load") {
            this.prompt.innerHTML = "Copy and paste the content of your SVG file into this box.";
            this.clipArea.value = '<!--example-->\n' +
                '<svg width="400" height="400" style="background-color: white;">\n' +
                '  <rect x="50" y="50" width="100" height="75"/>\n</svg>';
            this.loadButton.style.display = "inline-block";
        }
        else {
            this.prompt.innerHTML = "Copy and paste the content of this box into your SVG file.";
            this.loadButton.style.display = "none";
            let div = document.createElement("DIV");
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            div.appendChild(svg);
            svg.setAttribute("width", this.page.getAttribute("width"));
            svg.setAttribute("height", this.page.getAttribute("height"));
            svg.style.backgroundColor = this.page.getAttribute("fill");
            this.listHandler.selectRoot();
            let root = this.listHandler.getAll();
            let child = root.firstElementChild;
            while (child !== null) {
                svg.appendChild(child);
                child = root.firstElementChild;
            }
            this.clipArea.value = div.innerHTML;
        }
        this.clipStyle.display = "block";
    }
}
/// <reference path="head_handler.ts" />
/// <reference path="home_handler.ts" />
class Script {
    static main() {
        let list = new ListHandler();
        let navi = new NaviHandler();
        let props = new PropsHandler();
        let home = new HomeHandler(list);
        let tools = new ToolsHandler(list, props);
        let head = new HeadHandler(list, navi, tools);
    }
}
