// Skill Roadmap — Lesson 10: The Pain Point: Views That Lie
export default {
	id: 10,
	title: 'The Pain Point: Views That Lie',
	description: `This lesson ships **broken on purpose**. The global progress bar renders once at startup and never again; the path highlight paints once when you press its button and never again. Mark \`css\` done and both views lie to your face.\n\nDo not just read about desynchronisation — live it. Click around, catch each view lying, and notice the exact shape of the pain: every new view adds a render call you must remember in every mutation. Then fix it the only honest way Part A allows: call both renders from \`renderAll\`.`,
	task: `1. Press Run, note the bar percent, then mark \`css\` done: the bar does not move. That is the bug.\n2. Add a skill, press Highlight path, then complete a prerequisite: the highlight does not move either.\n3. Fix both by calling \`renderProgress\` and \`renderHighlight\` inside \`renderAll\`.\n4. Write down, in one sentence, when you would forget a call in a bigger app.`,
	concept: `**Manual sync does not scale** — with N views and M mutations you must remember N × M calls, and the compiler will not remind you. A view that renders once is a snapshot; a view that re-renders on every change is a mirror. Part A can only build snapshots and remember harder. Part B builds mirrors.`,
	whyItMatters: `This is the hinge of the whole module. Every reactivity system ever sold exists because of the afternoon you just had: one more view, one forgotten call, one lying pixel. Feel it now so the engine next lesson lands as relief, not magic.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 10</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Skill Roadmap</h1>
<div class="progress">
<div class="progress-track">
<div id="progress-fill" class="progress-fill"></div>
</div>
<p id="progress-label" class="progress-label"></p>
</div>
<div class="composer">
<button id="highlight-btn" class="btn" type="button">Highlight path</button>
<p id="status" class="status"></p>
</div>
<section id="roadmap" class="roadmap" aria-label="Roadmap"></section>
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

.composer {
display: flex;
gap: 8px;
align-items: center;
margin-top: 8px;
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

.counts {
color: #5b6572;
font-size: 13px;
}

.progress {
margin-top: 8px;
}

.progress-track {
background: #e1e7f0;
border-radius: 8px;
height: 12px;
overflow: hidden;
}

.progress-fill {
background: #12b76a;
height: 100%;
width: 0;
}

.progress-label {
color: #5b6572;
font-size: 13px;
margin: 4px 0 0;
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

.ready {
border-color: #12b76a;
box-shadow: 0 0 0 2px #12b76a;
}`,
		javascript: `// Skill Roadmap — Lesson 10: The Pain Point: Views That Lie
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const highlightButton = document.getElementById("highlight-btn");
const roadmap = document.getElementById("roadmap");
const status = document.getElementById("status");
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
function renderProgress() {
const done = nodes.filter(function (node) {
return node.status === "done";
}).length;
const percent = nodes.length === 0 ? 0 : Math.round((done / nodes.length) * 100);
progressFill.style.width = percent + "%";
progressLabel.textContent = percent + "% complete";
console.log("Bar repainted at " + percent + "%.");
}
function renderHighlight() {
const cards = roadmap.children;
for (let index = 0; index < cards.length; index = index + 1) {
const node = nodes[index];
if (node !== undefined && getStatus(node) === "ready") {
cards[index].className = "node ready";
} else {
cards[index].className = "node";
}
}
console.log("Highlight repainted.");
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
const doneCount = nodes.filter(function (node) {
return node.status === "done";
}).length;
counts.textContent = doneCount + " of " + nodes.length + " skills done";
status.textContent = nodes.length + " skills on the map";
}
function renderAll() {
// THE BUG, ON PURPOSE: renderProgress and renderHighlight are missing here.
// Add both calls and the bar plus highlight stop lying.
renderRoadmap();
}
function markDone(id) {
const node = nodeById(id);
if (node === undefined) {
return;
}
node.status = "done";
renderAll();
}
highlightButton.addEventListener("click", renderHighlight);
renderAll();
renderProgress();`
	}
};
