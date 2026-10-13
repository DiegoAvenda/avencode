// Skill Roadmap — Lesson 3: Derived Status with every and switch
export default {
	id: 3,
	title: 'Derived Status with every and switch',
	description: `Stored status is not the whole story: a \`todo\` skill whose prerequisites are all done is actually **ready**, and one with unfinished prerequisites is **blocked**. This lesson adds \`getStatus(node, nodes)\`, which derives the display status with \`every\` and picks the label with \`switch\`.\n\nThe render now shows derived truth: \`js\` is blocked while \`css\` is unfinished, and flips to ready the moment you mark \`css\` done (lesson 4 adds that button).`,
	task: `1. Press Run and read each node's derived status.\n2. In the code, flip \`css\` to \`"done"\` and run again: watch \`js\` become ready without any other change.\n3. Add a node with two prerequisites and confirm it stays blocked until both are done.`,
	concept: `**Derived state with every and switch** — \`every\` answers "are all prerequisites done?" in one line, and \`switch\` maps the stored status to its display twin. Nothing new is stored: the label is computed from data you already have, so it can never go stale.`,
	whyItMatters: `Derived values are the cheapest correctness you can buy: compute instead of store, and a whole class of "forgot to update" bugs disappears.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 3</title>
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
<section id="roadmap" class="roadmap" aria-label="Roadmap"></section>
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
max-width: 640px;
padding: 0 16px;
}

.app-title {
font-size: 28px;
margin: 0 0 8px;
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

.roadmap {
display: grid;
gap: 8px;
margin-top: 16px;
}

.node {
background: #fff;
border: 1px solid #e1e7f0;
border-radius: 8px;
padding: 8px 12px;
}

.node-title {
font-weight: bold;
margin: 0;
}

.node-status {
color: #5b6572;
font-size: 13px;
margin: 4px 0 0;
}`,
		javascript: `// Skill Roadmap — Lesson 3: Derived Status with every and switch
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
const nodes = [
{ id: "html", title: "HTML Basics", status: "done", prerequisites: [] },
{ id: "css", title: "CSS Basics", status: "in-progress", prerequisites: ["html"] },
{ id: "js", title: "JS Basics", status: "todo", prerequisites: ["css"] }
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
function render() {
roadmap.innerHTML = "";
for (const node of nodes) {
const card = document.createElement("div");
card.className = "node";
const heading = document.createElement("p");
heading.className = "node-title";
heading.textContent = node.title;
card.appendChild(heading);
const state = document.createElement("p");
state.className = "node-status";
state.textContent = getStatus(node) + " (stored: " + node.status + ")";
card.appendChild(state);
roadmap.appendChild(card);
}
status.textContent = nodes.length + " skills on the map";
console.log("Rendered " + nodes.length + " skills.");
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
nodes.push({ id: id, title: title, status: "todo", prerequisites: [] });
titleInput.value = "";
render();
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
render();
}
}
addButton.addEventListener("click", addNode);
addEdgeButton.addEventListener("click", addEdge);
render();`
	}
};
