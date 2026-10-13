// Skill Roadmap — Lesson 9: Suggested Order to a Goal
export default {
	id: 9,
	title: 'Suggested Order to a Goal',
	type: 'challenge',
	description: `**Integrative challenge (advanced and optional).** "What can I start today?" is answered; "in what order do I reach Events?" is not. The answer is a topological order: prerequisites first, goal last, found with a depth-first walk that pushes each node after its prerequisites.\n\n**The 80/20:** 80% is the app you just built (graph, guards, persistence). The new 20% is one small function with a fixed signature:\n\n\`\`\`\nsuggestedOrder(goalId)  // ids from first prerequisite to the goal itself\n\`\`\`\n\nPress **Run the checks**: four fixed cases grade your function (ends at the goal, prerequisites before dependents, single node, and unknown goal). When all four pass, a card reveals your next two practice builds.\n\n**Your next two builds after this module.**\n\n- Highlight the suggested path inside the layered view.\n- Skip done skills in the suggestion unless the goal itself is done.`,
	task: `1. Read \`suggestedOrder\`: it is the only TODO.\n2. Implement the walk: visit the goal, recurse into each prerequisite first, push the node after its prerequisites, skip visited ids.\n3. Type a goal id, press Show path, then press **Run the checks**. When all four pass, read your card — then solve both follow-up builds.`,
	concept: `**Topological order via post-order DFS** — push a node only after everything it needs is already pushed, and the list comes out executable: learn this, then this, then the goal. Visited ids keep shared ancestors (like \`html\`) listed once. It is the same DFS shape as cycle detection, pointed at a different question.`,
	whyItMatters: `Schedulers, installers and course unlocks all answer "in what order?" with topological sorts. It is the algorithm that turns a graph into a plan — and the last manual tool before Part B automates the views.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 9</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Skill Roadmap</h1>
<div class="composer">
<input id="goal-id" class="node-input" placeholder="Goal skill id..." />
<button id="show-path-btn" class="btn" type="button">Show path</button>
<button id="run-checks" class="btn" type="button">Run the checks</button>
</div>
<ol id="path-list" class="path-list"></ol>
<pre id="report" class="report">Press Run the checks.</pre>
<section id="card" class="card" hidden>
<h2 class="card-title">Challenge cleared</h2>
<p class="card-text">Next: 1) Highlight the suggested path inside the layered view. 2) Skip done skills in the suggestion unless the goal itself is done.</p>
</section>
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

.path-list {
display: grid;
gap: 8px;
margin: 16px 0 0;
padding: 0;
list-style: decimal inside;
}

.path-item {
background: #fff;
border: 1px solid #e1e7f0;
border-radius: 8px;
padding: 8px 12px;
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
		javascript: `// Skill Roadmap — Lesson 9: Suggested Order to a Goal
const goalInput = document.getElementById("goal-id");
const showPathButton = document.getElementById("show-path-btn");
const runChecksButton = document.getElementById("run-checks");
const pathList = document.getElementById("path-list");
const report = document.getElementById("report");
const card = document.getElementById("card");
const roadmap = document.getElementById("roadmap");
const nodes = [
{ id: "html", title: "HTML Basics", status: "done", prerequisites: [], branch: "Markup" },
{ id: "css", title: "CSS Basics", status: "in-progress", prerequisites: ["html"], branch: "Styling" },
{ id: "js", title: "JS Basics", status: "todo", prerequisites: ["css"], branch: "Scripting" },
{ id: "dom", title: "DOM Intro", status: "todo", prerequisites: ["html", "js"], branch: "Scripting" },
{ id: "events", title: "Events", status: "todo", prerequisites: ["dom"], branch: "Scripting" }
];
function nodeById(id) {
for (const node of nodes) {
if (node.id === id) {
return node;
}
}
return undefined;
}
function suggestedOrder(goalId) {
// YOUR CODE HERE: DFS post-order from goalId over prerequisites.
// Push each node after its prerequisites; skip visited ids.
return [];
}
function renderRoadmap() {
roadmap.innerHTML = "";
for (const node of nodes) {
const item = document.createElement("div");
item.className = "node";
const heading = document.createElement("p");
heading.className = "node-title";
heading.textContent = node.title + " (" + node.id + ")";
item.appendChild(heading);
roadmap.appendChild(item);
}
}
function showPath() {
const goalId = goalInput.value.trim();
if (goalId === "") {
console.log("Type a goal id first.");
return;
}
pathList.innerHTML = "";
const order = suggestedOrder(goalId);
for (const id of order) {
const item = document.createElement("li");
item.className = "path-item";
const node = nodeById(id);
item.textContent = node === undefined ? id : node.title;
pathList.appendChild(item);
}
console.log("Path to " + goalId + ": " + order.join(" -> "));
}
function check(name, actual, expected) {
const pass = JSON.stringify(actual) === JSON.stringify(expected);
console.log((pass ? "PASS" : "FAIL") + " " + name);
return { name: name, pass: pass };
}
function runAllChecks() {
const toEvents = suggestedOrder("events");
const results = [
check("path ends at the goal", toEvents[toEvents.length - 1], "events"),
check("prerequisites come before dependents", toEvents.indexOf("dom") < toEvents.indexOf("events") && toEvents.indexOf("js") < toEvents.indexOf("dom"), true),
check("single node suggests itself", suggestedOrder("html"), ["html"]),
check("unknown goal returns itself", suggestedOrder("ghost"), ["ghost"])
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
showPathButton.addEventListener("click", showPath);
runChecksButton.addEventListener("click", runAllChecks);
renderRoadmap();`
	}
};
