// Skill Roadmap — Lesson 7: Forbid Cycles with DFS
export default {
	id: 7,
	title: 'Forbid Cycles with DFS',
	description: `A roadmap with a loop is a lie: \`html\` requiring \`events\` while \`events\` descends from \`html\` means nothing can start. This lesson adds \`wouldCreateCycle(fromId, toId)\`: adding "from requires to" is refused when \`from\` is already reachable from \`to\`, found with a depth-first search and a \`Set\` of visited ids.\n\nPress **Run the checks**: four fixed cases grade your function (self-edge, back-edge, longer loop, and a safe forward edge). When all four pass, a card reveals your next two practice builds.`,
	task: `1. Read \`wouldCreateCycle\`: it is the only TODO.\n2. Implement the DFS: return true for a self-edge, then walk prerequisites from \`toId\` with a visited set and report whether \`fromId\` is reachable.\n3. Press **Run the checks**. When all four pass, read your card — then solve both follow-up builds.`,
	concept: `**Cycle detection with DFS** — start at the proposed prerequisite and walk every prerequisite-of-prerequisite, marking visited ids so shared ancestors do not loop you forever. Reaching the dependent means the edge would close a loop. \`Set\` gives the visited check in constant time; recursion gives the walk its shape.`,
	whyItMatters: `Dependency graphs run the world: packages, builds, task runners, course unlocks. "Would this edge create a cycle?" is the guard behind every one of them, and DFS with a visited set is the canonical answer.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 7</title>
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
<button id="run-checks" class="btn" type="button">Run the checks</button>
<p id="status" class="status"></p>
</div>
<section id="roadmap" class="roadmap" aria-label="Roadmap"></section>
<pre id="report" class="report">Press Run the checks.</pre>
<section id="card" class="card" hidden>
<h2 class="card-title">Checks cleared</h2>
<p class="card-text">Next: 1) Refuse edges that name an unknown skill id. 2) List every skill that would become unreachable if a node were removed.</p>
</section>
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

.report {
background: #101828;
border-radius: 8px;
color: #d1fadf;
font-family: ui-monospace, monospace;
font-size: 13px;
margin-top: 16px;
overflow-x: auto;
padding: 12px 16px;
}

.card {
background: #ecfdf3;
border: 1px solid #12b76a;
border-radius: 8px;
margin-top: 16px;
padding: 12px 16px;
}

.card-title {
font-size: 18px;
margin: 0 0 4px;
}

.card-text {
margin: 0;
}`,
		javascript: `// Skill Roadmap — Lesson 7: Forbid Cycles with DFS
const titleInput = document.getElementById("node-title");
const addButton = document.getElementById("add-btn");
const fromInput = document.getElementById("edge-from");
const toInput = document.getElementById("edge-to");
const addEdgeButton = document.getElementById("add-edge-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
const runChecks = document.getElementById("run-checks");
const report = document.getElementById("report");
const card = document.getElementById("card");
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
function wouldCreateCycle(fromId, toId) {
// YOUR CODE HERE: true for a self-edge; then DFS from toId over
// prerequisites with a visited set, true when fromId is reachable.
return false;
}
function slug(title) {
return title.toLowerCase().trim().split(" ").join("-");
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
function render() {
roadmap.innerHTML = "";
for (const node of nodes) {
const item = document.createElement("div");
item.className = "node";
const heading = document.createElement("p");
heading.className = "node-title";
heading.textContent = node.title;
item.appendChild(heading);
const state = document.createElement("p");
state.className = "node-status";
state.textContent = getStatus(node);
item.appendChild(state);
roadmap.appendChild(item);
}
status.textContent = nodes.length + " skills on the map";
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
render();
}
}
function check(name, actual, expected) {
const pass = actual === expected;
console.log((pass ? "PASS" : "FAIL") + " " + name);
return { name: name, pass: pass };
}
function runAllChecks() {
const results = [
check("self-edge is a cycle", wouldCreateCycle("html", "html"), true),
check("back-edge html <- events path is refused", wouldCreateCycle("css", "dom"), true),
check("longer loop dom -> html is refused", wouldCreateCycle("html", "dom"), true),
check("safe forward edge is allowed", wouldCreateCycle("dom", "css"), false)
];
const passed = results.filter(function (entry) {
return entry.pass;
}).length;
const lines = results.map(function (entry) {
return (entry.pass ? "PASS" : "FAIL") + " " + entry.name;
});
report.textContent = lines.join("\\n") + "\\n" + passed + " of " + results.length + " checks pass.";
if (passed === results.length) {
card.hidden = false;
}
}
addButton.addEventListener("click", addNode);
addEdgeButton.addEventListener("click", addEdge);
runChecks.addEventListener("click", runAllChecks);
render();`
	}
};
