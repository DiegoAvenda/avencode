// Skill Roadmap — Lesson 6: Layers with Grid and SVG
export default {
	id: 6,
	title: 'Layers with Grid and SVG',
	description: `A list cannot show structure. This lesson computes each node's **depth** (0 with no prerequisites, else one past its deepest prerequisite) and paints one CSS Grid column per depth — with an SVG line per prerequisite edge.\n\nNo Canvas anywhere: layout is pure CSS Grid, connectors are native \`<line>\` elements. Depth is derived, like status: computed from the graph, never stored.`,
	task: `1. Press Run: \`dom\` sits in layer 3 because its deepest chain is three long.\n2. Add a skill requiring \`dom\` and watch a new layer column appear.\n3. In \`computeDepth\`, trace by hand why \`events\` (if you add it under \`dom\`) lands one past \`dom\`.`,
	concept: `**Layout from data** — depth turns a graph into columns: group nodes by their number, render one column each, draw one line per edge. The view is a pure function of the graph, which is exactly why Part B will be able to regenerate it for free.`,
	whyItMatters: `Layered drawings are how teams read architectures, roadmaps and dependency graphs. Computing positions instead of hardcoding them is what makes the drawing survive new data.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 6</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Skill Roadmap</h1>
<div class="composer">
<input id="node-title" class="node-input" placeholder="New skill title..." />
<button id="add-btn" class="btn" type="button">Add Skill</button>
</div>
<div class="composer">
<input id="edge-from" class="node-input" placeholder="Skill id..." />
<input id="edge-to" class="node-input" placeholder="Requires skill id..." />
<button id="add-edge-btn" class="btn" type="button">Add Prerequisite</button>
</div>
<p id="status" class="status"></p>
<h2 class="section-title">Layers</h2>
<section id="layers" class="layers" aria-label="Layers"></section>
<svg id="edges" class="edges" aria-label="Connectors"></svg>
<h2 class="section-title">Next step</h2>
<ul id="next-list" class="next-list"></ul>
<p id="counts" class="counts"></p>
</main>
<script src="app.js"></script>
</body>
</html>`,
		css: `body {
background: #f4f6fb;
color: #1c2430;
font-family: system-ui, sans-serif;
margin: 0;
}

.app {
margin: 32px auto;
max-width: 720px;
padding: 0 16px;
}

.app-title {
font-size: 28px;
margin: 0 0 8px;
}

.section-title {
font-size: 18px;
margin: 24px 0 8px;
}

.composer {
display: flex;
gap: 8px;
align-items: flex-start;
margin-top: 8px;
}

.node-input {
flex: 1;
border: 1px solid #c7d0dd;
border-radius: 8px;
font: inherit;
padding: 8px 12px;
}

.btn {
background: #2563eb;
border: none;
border-radius: 8px;
color: #fff;
cursor: pointer;
font: inherit;
padding: 10px 16px;
}

.btn:hover {
background: #1d4ed8;
}

.status {
color: #5b6572;
font-size: 13px;
}

.counts {
color: #5b6572;
font-size: 13px;
}

.layers {
display: grid;
gap: 8px;
margin-top: 8px;
}

.layer {
background: #fff;
border: 1px solid #e1e7f0;
border-radius: 8px;
padding: 8px 12px;
}

.layer-title {
font-weight: bold;
margin: 0 0 4px;
}

.layer-nodes {
color: #5b6572;
font-size: 13px;
margin: 0;
}

.edges {
display: block;
height: 120px;
margin-top: 8px;
width: 100%;
}

.next-list {
display: grid;
gap: 8px;
list-style: none;
margin: 0;
padding: 0;
}

.next-item {
background: #ecfdf3;
border: 1px solid #12b76a;
border-radius: 8px;
padding: 8px 12px;
}`,
		javascript: `// Skill Roadmap — Lesson 6: Layers with Grid and SVG
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const status = document.getElementById("status");
const layers = document.getElementById("layers");
const edges = document.getElementById("edges");
const nextList = document.getElementById("next-list");
const counts = document.getElementById("counts");
const nodes = [
{ id: "html", title: "HTML Basics", status: "done", prerequisites: [], branch: "Markup" },
{ id: "css", title: "CSS Basics", status: "in-progress", prerequisites: ["html"], branch: "Styling" },
{ id: "js", title: "JS Basics", status: "todo", prerequisites: ["css"], branch: "Scripting" },
{ id: "dom", title: "DOM Intro", status: "todo", prerequisites: ["html", "js"], branch: "Scripting" }
];
function nodeById(id) {
for (const node of nodes) {
if (node.id === id) {
return node;
}
}
return undefined;
}
function getStatus(node) {
switch (node.status) {
case "done":
return "done";
case "in-progress":
return "in progress";
default: {
const allDone = node.prerequisites.every(function (id) {
return nodeById(id) !== undefined && nodeById(id).status === "done";
});
switch (allDone) {
case true:
return "ready";
default:
return "blocked";
}
}
}
}
function slug(title) {
return title.toLowerCase().trim().split(" ").join("-");
}
function computeDepth() {
const depths = {};
const seen = {};
function depthOf(id) {
if (depths[id] !== undefined) {
return depths[id];
}
if (seen[id] === true) {
return 0;
}
seen[id] = true;
const node = nodeById(id);
let depth = 0;
if (node !== undefined) {
for (const parent of node.prerequisites) {
depth = Math.max(depth, depthOf(parent) + 1);
}
}
seen[id] = false;
depths[id] = depth;
return depth;
}
for (const node of nodes) {
depthOf(node.id);
}
return depths;
}
function renderLayers() {
layers.innerHTML = "";
const depths = computeDepth();
let maxDepth = 0;
for (const node of nodes) {
maxDepth = Math.max(maxDepth, depths[node.id]);
}
layers.style.gridTemplateColumns = "repeat(" + (maxDepth + 1) + ", 1fr)";
for (let depth = 0; depth <= maxDepth; depth = depth + 1) {
const column = document.createElement("div");
column.className = "layer";
const heading = document.createElement("p");
heading.className = "layer-title";
heading.textContent = "Layer " + depth;
column.appendChild(heading);
const names = nodes.filter(function (node) {
return depths[node.id] === depth;
}).map(function (node) {
return node.title;
});
const line = document.createElement("p");
line.className = "layer-nodes";
line.textContent = names.join(", ");
column.appendChild(line);
layers.appendChild(column);
}
console.log("Deepest layer: " + maxDepth);
}
function renderEdges() {
while (edges.firstChild) {
edges.removeChild(edges.firstChild);
}
const depths = computeDepth();
let row = 0;
for (const node of nodes) {
for (const parent of node.prerequisites) {
const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
line.setAttribute("x1", String(depths[parent] * 120 + 20));
line.setAttribute("y1", String(row * 24 + 12));
line.setAttribute("x2", String(depths[node.id] * 120 + 20));
line.setAttribute("y2", String(row * 24 + 12));
line.setAttribute("stroke", "#2563eb");
line.setAttribute("stroke-width", "2");
edges.appendChild(line);
row = row + 1;
}
}
console.log("Connectors drawn: " + row);
}
function renderNext() {
nextList.innerHTML = "";
const ready = nodes.filter(function (node) {
return getStatus(node) === "ready";
});
for (const node of ready) {
const item = document.createElement("li");
item.className = "next-item";
item.textContent = node.title;
nextList.appendChild(item);
}
}
function renderCounts() {
const done = nodes.filter(function (node) {
return node.status === "done";
}).length;
counts.textContent = done + " of " + nodes.length + " skills done";
status.textContent = nodes.length + " skills on the map";
}
function renderAll() {
renderLayers();
renderEdges();
renderNext();
renderCounts();
}
function addNode() {
const title = titleInput.value.trim();
if (title === "") {
console.log("A skill needs a title.");
return;
}
const id = slug(title);
if (nodeById(id) !== undefined) {
console.log("That id is taken: " + id);
return;
}
nodes.push({ id: id, title: title, status: "todo", prerequisites: [], branch: "Scripting" });
titleInput.value = "";
renderAll();
}
function addEdge() {
const from = fromInput.value.trim();
const to = toInput.value.trim();
if (from === "" || to === "") {
console.log("Both fields need an id.");
} else if (from === to) {
console.log("A skill cannot require itself.");
} else if (nodeById(from) === undefined || nodeById(to) === undefined) {
console.log("Unknown skill id.");
} else if (nodeById(from).prerequisites.indexOf(to) !== -1) {
console.log("That link already exists.");
} else {
nodeById(from).prerequisites.push(to);
renderAll();
}
}
addButton.addEventListener("click", addNode);
addEdgeButton.addEventListener("click", addEdge);
renderAll();`
	}
};
