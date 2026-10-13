// Skill Roadmap — Lesson 5: Branch and Global Progress
export default {
	id: 5,
	title: 'Branch and Global Progress',
	description: `One global counter hides the truth: Markup can be finished while Scripting has not started. This lesson groups nodes by \`branch\` and computes progress per branch plus a global total — with \`filter\`, \`map\` and \`reduce\`, the three transforms this lesson is really about.\n\n\`map\` collects branch names, \`filter\` scopes nodes to one branch, \`reduce\` folds them into a done-count. Same three tools, three jobs.`,
	task: `1. Press Run and read each branch line: done of total plus percent.\n2. Mark \`css\` done and watch Styling hit 100% while Scripting stays behind.\n3. In \`branchNames\`, explain out loud why \`filter\` with \`indexOf\` removes duplicates.`,
	concept: `**Transform pipelines** — \`map\` reshapes every element, \`filter\` keeps the ones that pass a test, \`reduce\` folds many values into one. Branch progress is all three in a row: names via map, scope via filter, done-count via reduce. Recognise the shape and you will read any data pipeline.`,
	whyItMatters: `Real dashboards are group-by plus math. Per-branch progress is the first view that answers "where am I weak?" instead of "how much did I do?" — and the transforms behind it show up in every codebase.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 5</title>
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
<h2 class="section-title">Progress by branch</h2>
<section id="branches" class="branches" aria-label="Progress by branch"></section>
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

.branches {
display: grid;
gap: 8px;
margin-top: 8px;
}

.branch {
background: #fff;
border: 1px solid #e1e7f0;
border-radius: 8px;
padding: 8px 12px;
}

.branch-title {
font-weight: bold;
margin: 0;
}

.branch-progress {
color: #5b6572;
font-size: 13px;
margin: 4px 0 0;
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
		javascript: `// Skill Roadmap — Lesson 5: Branch and Global Progress
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
const nextList = document.getElementById("next-list");
const branches = document.getElementById("branches");
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
function branchNames() {
const all = nodes.map(function (node) {
return node.branch;
});
return all.filter(function (name, index) {
return all.indexOf(name) === index;
});
}
function branchProgress(branch) {
const scoped = nodes.filter(function (node) {
return node.branch === branch;
});
const done = scoped.reduce(function (count, node) {
return count + (node.status === "done" ? 1 : 0);
}, 0);
const percent = scoped.length === 0 ? 0 : Math.round((done / scoped.length) * 100);
return { total: scoped.length, done: done, percent: percent };
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
}
function renderBranches() {
branches.innerHTML = "";
const names = branchNames();
for (const name of names) {
const progress = branchProgress(name);
const card = document.createElement("div");
card.className = "branch";
const heading = document.createElement("p");
heading.className = "branch-title";
heading.textContent = name;
card.appendChild(heading);
const line = document.createElement("p");
line.className = "branch-progress";
line.textContent = progress.done + " of " + progress.total + " · " + progress.percent + "%";
card.appendChild(line);
branches.appendChild(card);
}
console.log("Branches: " + names.join(", "));
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
renderBranches();
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
renderBranches();
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
