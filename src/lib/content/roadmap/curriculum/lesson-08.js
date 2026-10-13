// Skill Roadmap — Lesson 8: Persist with localStorage
export default {
	id: 8,
	title: 'Persist with localStorage',
	description: `Reload the page and the map dies. This lesson persists the \`nodes\` array in \`localStorage\` under one key: every mutation saves, startup loads, and anything unexpected (nothing saved, corrupt text, wrong shape) falls back to the seed map with a console note.\n\nA **Reset** button wipes the save and restores the seeds, so experiments are always reversible.`,
	task: `1. Press Run, add a skill, reload the preview: your skill survives.\n2. Open the console, type garbage into the key with \`localStorage.setItem\`, reload: the app starts fresh instead of crashing.\n3. Press Reset and confirm the seeds return.`,
	concept: `**Serialize the state, guard the load** — \`JSON.stringify\` turns the array into text for storage; \`JSON.parse\` plus shape checks turn text back into a map you can trust. The loader returns \`null\` for anything it cannot understand, and the caller picks the seeds. Persistence you cannot corrupt is persistence you can rely on.`,
	whyItMatters: `Client state that evaporates on reload is a toy. Save-on-mutate plus defensive load is the smallest honest persistence story, and it ports to every storage API you will meet.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 8</title>
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
<div class="toolbar">
<button id="reset-btn" class="btn" type="button">Reset</button>
<p id="status" class="status"></p>
</div>
<section id="roadmap" class="roadmap" aria-label="Roadmap"></section>
<pre id="report" class="report">Saved map loads on start.</pre>
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

.toolbar {
display: flex;
gap: 12px;
align-items: center;
margin-top: 12px;
flex-wrap: wrap;
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
margin: 0;
}

.roadmap {
display: grid;
gap: 8px;
margin-top: 16px;
}

.node {
display: flex;
gap: 8px;
align-items: center;
background: #fff;
border: 1px solid #e1e7f0;
border-radius: 8px;
padding: 8px 12px;
}

.node-title {
flex: 1;
font-weight: bold;
margin: 0;
}

.node-status {
color: #5b6572;
font-size: 13px;
margin: 0;
}

.node-done {
background: transparent;
border: 1px solid #12b76a;
border-radius: 8px;
color: #027a48;
cursor: pointer;
font: inherit;
padding: 6px 10px;
}

.report {
background: #101828;
border-radius: 8px;
color: #d1fadf;
font-family: ui-monospace, monospace;
font-size: 13px;
margin-top: 16px;
overflow-x: auto;
padding: 12px 16px;
}`,
		javascript: `// Skill Roadmap — Lesson 8: Persist with localStorage
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const resetButton = document.getElementById("reset-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
const report = document.getElementById("report");
const STORAGE_KEY = "skill-roadmap";
function seedNodes() {
return [
{ id: "html", title: "HTML Basics", status: "done", prerequisites: [], branch: "Markup" },
{ id: "css", title: "CSS Basics", status: "in-progress", prerequisites: ["html"], branch: "Styling" },
{ id: "js", title: "JS Basics", status: "todo", prerequisites: ["css"], branch: "Scripting" },
{ id: "dom", title: "DOM Intro", status: "todo", prerequisites: ["html", "js"], branch: "Scripting" }
];
}
function loadNodes() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw === null) {
return null;
}
const parsed = JSON.parse(raw);
if (Array.isArray(parsed)) {
return parsed;
}
return null;
} catch (error) {
console.log("Saved map was unreadable. Starting fresh.");
return null;
}
}
let nodes = loadNodes() || seedNodes();
function saveNodes() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
}
function nodeById(id) {
for (const node of nodes) {
if (node.id === id) {
return node;
}
}
return undefined;
}
function wouldCreateCycle(fromId, toId) {
if (fromId === toId) {
return true;
}
const visited = {};
function reaches(id) {
if (id === fromId) {
return true;
}
if (visited[id] === true) {
return false;
}
visited[id] = true;
const node = nodeById(id);
const parents = node === undefined ? [] : node.prerequisites;
for (const parent of parents) {
if (reaches(parent)) {
return true;
}
}
return false;
}
return reaches(toId);
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
state.textContent = getStatus(node);
card.appendChild(state);
const done = document.createElement("button");
done.className = "node-done";
done.textContent = "Done";
done.type = "button";
done.addEventListener("click", function () {
markDone(node.id);
});
card.appendChild(done);
roadmap.appendChild(card);
}
status.textContent = nodes.length + " skills on the map";
report.textContent = "Saved " + nodes.length + " skills under " + STORAGE_KEY + ".";
}
function markDone(id) {
const node = nodeById(id);
if (node === undefined) {
return;
}
node.status = "done";
saveNodes();
render();
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
saveNodes();
render();
}
function addEdge() {
const from = fromInput.value.trim();
const to = toInput.value.trim();
if (from === "" || to === "") {
console.log("Both fields need an id.");
} else if (nodeById(from) === undefined || nodeById(to) === undefined) {
console.log("Unknown skill id.");
} else if (nodeById(from).prerequisites.indexOf(to) !== -1) {
console.log("That link already exists.");
} else if (wouldCreateCycle(from, to)) {
console.log("Refused: that link would close a loop.");
} else {
nodeById(from).prerequisites.push(to);
saveNodes();
render();
}
}
function resetAll() {
nodes = seedNodes();
saveNodes();
render();
console.log("Map reset to the seeds.");
}
addButton.addEventListener("click", addNode);
addEdgeButton.addEventListener("click", addEdge);
resetButton.addEventListener("click", resetAll);
render();`
	}
};
