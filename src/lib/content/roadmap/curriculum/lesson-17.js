// Skill Roadmap — Lesson 17: Extension Stage: Make It Yours
export default {
	id: 17,
	title: 'Extension Stage: Make It Yours',
	description: `The guided road ends; your roadmap begins. The starter is the complete connected app from lesson 15 plus JSON export and import, so your work can leave the browser. Pick your own domain and extend on four open tracks: your skills, time estimates or a critical path, import/export round-trips, and your own visual identity.\n\nDecisions are the deliverable: keep a decisions log (what you chose, what you gave up, what you would change with more time). A shipped extension with written trade-offs beats a bigger one with none.`,
	task: `1. Export the seed map, edit one title in the JSON, import it back.\n2. Replace the seeds with your own domain (at least 6 skills, 2 branches, 1 convergence).\n3. Pick one track: time estimates with a critical path, prettier layered drawing, or stricter import validation with error messages.\n4. Write your decisions log as code comments at the top of your script: domain, estimate model, JSON shape, visual choices, and one known limitation.\n5. Mark the lesson complete — Module 0 is yours.`,
	concept: `**Open scope, closed habits** — no new primitives are needed: signals hold whatever shape you invent, effects repaint whatever views you add, memos cache whatever you derive. Extension is composition of the sixteen lessons behind you, plus the discipline of writing down what you decided and what you refused.`,
	whyItMatters: `Portfolios are judged on finished, explained work. A personal roadmap with exportable JSON, your own domain and a decisions log is a demo you can show and an interview story you can tell — including the diamond limitation, which proves you understand your tools' edges.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 17</title>
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
<p id="counts" class="counts"></p>
<h2 class="section-title">Take it with you</h2>
<div class="composer">
<textarea id="export-box" class="export-box" placeholder="Exported JSON lands here..."></textarea>
</div>
<div class="composer">
<button id="export-btn" class="btn" type="button">Export JSON</button>
<button id="import-btn" class="btn" type="button">Import JSON</button>
</div>
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

.export-box {
flex: 1;
min-height: 96px;
border: 1px solid #c7d0dd;
border-radius: 8px;
font-family: ui-monospace, monospace;
font-size: 12px;
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
}`,
		javascript: `// Skill Roadmap — Lesson 17: Extension Stage: Make It Yours
// DECISIONS LOG (yours goes here):
// - Domain: web-dev skills. Mine will be: ...
// - Estimate model: none yet. Mine will be: ...
// - JSON shape: [{ id, title, status, prerequisites, branch }]. Changes: ...
// - Visual identity: default light. Mine will be: ...
// - Known limitation: diamond double-runs (see lesson 16).
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
const counts = document.getElementById("counts");
const exportBox = document.getElementById("export-box");
const exportButton = document.getElementById("export-btn");
const importButton = document.getElementById("import-btn");
let currentSubscriber = null;
function createSignal(initial) {
let value = initial;
const subscribers = new Set();
return {
get: function () {
if (currentSubscriber !== null) {
subscribers.add(currentSubscriber);
}
return value;
},
set: function (next) {
if (Object.is(next, value)) {
return;
}
value = next;
const snapshot = Array.from(subscribers);
for (const subscriber of snapshot) {
subscriber();
}
}
};
}
function createEffect(fn) {
const run = function () {
currentSubscriber = run;
try {
fn();
} finally {
currentSubscriber = null;
}
};
run();
return run;
}
function seedNodes() {
return [
{ id: "html", title: "HTML Basics", status: "done", prerequisites: [], branch: "Markup" },
{ id: "css", title: "CSS Basics", status: "in-progress", prerequisites: ["html"], branch: "Styling" },
{ id: "js", title: "JS Basics", status: "todo", prerequisites: ["css"], branch: "Scripting" },
{ id: "dom", title: "DOM Intro", status: "todo", prerequisites: ["html", "js"], branch: "Scripting" }
];
}
const nodesSignal = createSignal(seedNodes());
function nodeById(list, id) {
for (const node of list) {
if (node.id === id) {
return node;
}
}
return undefined;
}
function getStatus(list, node) {
switch (node.status) {
case "done":
return "done";
case "in-progress":
return "in progress";
default: {
const allDone = node.prerequisites.every(function (id) {
return nodeById(list, id) !== undefined && nodeById(list, id).status === "done";
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
function markDone(id) {
const next = nodesSignal.get().map(function (node) {
if (node.id === id) {
return { id: node.id, title: node.title, status: "done", prerequisites: node.prerequisites, branch: node.branch };
}
return node;
});
nodesSignal.set(next);
}
function addNode() {
const title = titleInput.value.trim();
if (title === "") {
console.log("A skill needs a title.");
return;
}
const id = slug(title);
if (nodeById(nodesSignal.get(), id) !== undefined) {
console.log("That id is taken: " + id);
return;
}
const next = nodesSignal.get().slice();
next.push({ id: id, title: title, status: "todo", prerequisites: [], branch: "Scripting" });
titleInput.value = "";
nodesSignal.set(next);
}
function addEdge() {
const from = fromInput.value.trim();
const to = toInput.value.trim();
const list = nodesSignal.get();
if (from === "" || to === "") {
console.log("Both fields need an id.");
return;
}
if (nodeById(list, from) === undefined || nodeById(list, to) === undefined) {
console.log("Unknown skill id.");
return;
}
const next = list.map(function (node) {
if (node.id === from) {
const parents = node.prerequisites.slice();
parents.push(to);
return { id: node.id, title: node.title, status: node.status, prerequisites: parents, branch: node.branch };
}
return node;
});
nodesSignal.set(next);
}
function exportJson() {
exportBox.value = JSON.stringify(nodesSignal.get(), null, 2);
console.log("Exported " + nodesSignal.get().length + " skills as JSON.");
}
function importJson() {
try {
const parsed = JSON.parse(exportBox.value);
if (!Array.isArray(parsed)) {
console.log("Import refused: the JSON must be an array of skills.");
return;
}
nodesSignal.set(parsed);
console.log("Imported " + parsed.length + " skills.");
} catch (error) {
console.log("Import refused: that text is not valid JSON.");
}
}
createEffect(function () {
const list = nodesSignal.get();
roadmap.innerHTML = "";
for (const node of list) {
const card = document.createElement("div");
card.className = "node";
const heading = document.createElement("p");
heading.className = "node-title";
heading.textContent = node.title;
card.appendChild(heading);
const state = document.createElement("p");
state.className = "node-status";
state.textContent = getStatus(list, node);
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
status.textContent = list.length + " skills on the map";
const done = list.filter(function (node) {
return node.status === "done";
}).length;
counts.textContent = done + " of " + list.length + " skills done";
});
addButton.addEventListener("click", addNode);
addEdgeButton.addEventListener("click", addEdge);
exportButton.addEventListener("click", exportJson);
importButton.addEventListener("click", importJson);
console.log("Extension stage ready: your domain, your tracks, your log.");`
	}
};
