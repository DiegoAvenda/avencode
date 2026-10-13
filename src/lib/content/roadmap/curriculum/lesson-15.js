// Skill Roadmap — Lesson 15: Connect the Whole App
export default {
	id: 15,
	title: 'Connect the Whole App',
	description: `Everything converges here: the node array becomes a signal, the roadmap, next-step list and counters become effects, and every manual render call gets deleted. Buttons now only touch state —\`markDone\`, \`addNode\` and \`addEdge\` end with a single \`set\`, and the interface updates itself.\n\nRead each mutation twice: once for what it changes, once for what it no longer calls. The missing calls are the feature.`,
	task: `1. Press Run and use every control: nothing calls a render, everything repaints.\n2. Delete one \`createEffect\` and watch exactly one view freeze — proof each view owns itself.\n3. Count the render calls left in the mutations. The answer should be zero.`,
	concept: `**State writes, views follow** — one signal holds the graph, effects subscribe by reading it, memos cache the derivations in between. Mutations produce new arrays and \`set\` them once. The N × M call matrix from lesson 10 collapses to M one-line updates.`,
	whyItMatters: `This is a working reactive application with no library: under fifty lines of engine, zero framework. You now own the idea every frontend framework sells — state as the single source, views as subscribed computations.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 15</title>
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
		javascript: `// Skill Roadmap — Lesson 15: Connect the Whole App
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
const nextList = document.getElementById("next-list");
const counts = document.getElementById("counts");
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
});
createEffect(function () {
const list = nodesSignal.get();
nextList.innerHTML = "";
const ready = list.filter(function (node) {
return getStatus(list, node) === "ready";
});
for (const node of ready) {
const item = document.createElement("li");
item.className = "next-item";
item.textContent = node.title;
nextList.appendChild(item);
}
const done = list.filter(function (node) {
return node.status === "done";
}).length;
counts.textContent = done + " of " + list.length + " skills done";
});
addButton.addEventListener("click", addNode);
addEdgeButton.addEventListener("click", addEdge);
console.log("Wired: state writes, views follow. Zero manual renders.");`
	}
};
