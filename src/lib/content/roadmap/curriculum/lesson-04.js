// Skill Roadmap — Lesson 4: Complete a Skill, Recalculate by Hand
export default {
	id: 4,
	title: 'Complete a Skill, Recalculate by Hand',
	description: `Derived status is useless without a way to change stored status. This lesson adds a **Done** button to every card, plus two new views: a **next step** list (every ready skill) and **counters** (done of total).\n\nOne click recalculates everything by hand: the node, its dependents, the progress, the next-step list and the counters — five explicit calls in \`markDone\`. Count them. Their number is the lesson of Part A.`,
	task: `1. Press Run, then mark \`css\` done: watch \`js\` flip to ready, the next-step list and the counters move.\n2. Open \`markDone\` and count the render calls one click triggers.\n3. Add a skill with two prerequisites and confirm the next-step list waits for both.`,
	concept: `**Manual recalculation** — without reactivity, every state change must call every render that could be affected: the node, its dependents, the progress, the next steps, the counters. Miss one call and a view lies. This explicit list is Part A's engine, and Part B exists to delete it.`,
	whyItMatters: `You cannot appreciate automatic updates until you have been the update mechanism. This is the "pain first" half of the module: live it now, automate it later.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 4</title>
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
		javascript: `// Skill Roadmap — Lesson 4: Complete a Skill, Recalculate by Hand
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
const nextList = document.getElementById("next-list");
const counts = document.getElementById("counts");
const nodes = [
{ id: "html", title: "HTML Basics", status: "done", prerequisites: [] },
{ id: "css", title: "CSS Basics", status: "in-progress", prerequisites: ["html"] },
{ id: "js", title: "JS Basics", status: "todo", prerequisites: ["css"] },
{ id: "dom", title: "DOM Intro", status: "todo", prerequisites: ["html", "js"] }
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
function renderRoadmap() {
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
console.log("Next up: " + ready.length + " skills.");
}
function renderCounts() {
const done = nodes.filter(function (node) {
return node.status === "done";
}).length;
counts.textContent = done + " of " + nodes.length + " skills done";
status.textContent = nodes.length + " skills on the map";
}
function renderAll() {
renderRoadmap();
renderNext();
renderCounts();
}
function markDone(id) {
const node = nodeById(id);
if (node === undefined) {
return;
}
node.status = "done";
renderRoadmap();
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
nodes.push({ id: id, title: title, status: "todo", prerequisites: [] });
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
