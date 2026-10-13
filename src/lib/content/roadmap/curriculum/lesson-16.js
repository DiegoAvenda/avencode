// Skill Roadmap — Lesson 16: Final Boss: The Diamond
export default {
	id: 16,
	title: 'Final Boss: The Diamond',
	type: 'challenge',
	description: `**Integrative challenge (boss fight).** Two branches converge: one source feeds \`left\` and \`right\`, and one effect reads both. Change the source and the effect runs **twice** — first with the new left and the stale right, then converged.\n\nThis is not your bug to fix. The engine notifies depth-first with no ordering, so converging branches wake shared readers once per branch. **Documented limitation, on purpose:** Module 1 fixes it by recalculating in topological order. Your job is to prove the behavior with the checks below and write down exactly why it happens.\n\nPress **Run the checks**: four fixed cases pin the behavior (one initial run, two runs per change, mixed first snapshot, converged second snapshot). When all four pass, a card reveals what Module 1 changes.\n\n**After this module.**\n\n- Recalculate derivations in topological order so shared readers run once.\n- Batch notifications so one source change means one downstream pass.`,
	task: `1. Press Run: the effect snapshots \`[10, 100]\` once.\n2. Press **Run the checks** and read each snapshot: the middle one mixes new left with stale right.\n3. In one sentence per question: why twice, and why is the first run mixed?\n4. When all four pass, read your card — then name the Module 1 fix out loud.`,
	concept: `**Unordered notification breaks diamonds** — when the source changes, \`left\` recomputes and wakes the effect before \`right\` has recomputed, so the first run reads across time: new left, old right. Then \`right\` recomputes, wakes the effect again, and the second run converges. Depth-first notification has no notion of "wait for every branch". Topological recalculation (Module 1) is the notion it is missing.`,
	whyItMatters: `Knowing a tool's exact failure shape is senior knowledge: you will recognise double-run glitches in every reactive system now, and you will know the fix by name before Module 1 teaches it. Limitations you can demonstrate beat features you cannot explain.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 16</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Final Boss: The Diamond</h1>
<div class="composer">
<button id="run-checks" class="btn" type="button">Run the checks</button>
<p id="status" class="status">One source, two branches, one reader.</p>
</div>
<pre id="report" class="report">Press Run the checks.</pre>
<section id="card" class="card" hidden>
<h2 class="card-title">Boss cleared</h2>
<p class="card-text">Module 1 fix preview: 1) Recalculate derivations in topological order so shared readers run once. 2) Batch notifications so one source change means one downstream pass.</p>
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
		javascript: `// Skill Roadmap — Lesson 16: Final Boss: The Diamond
const runChecksButton = document.getElementById("run-checks");
const report = document.getElementById("report");
const card = document.getElementById("card");
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
function createMemo(fn) {
let cached;
let dirty = true;
const listeners = new Set();
const markDirty = function () {
dirty = true;
const snapshot = Array.from(listeners);
for (const listener of snapshot) {
listener();
}
};
const compute = function () {
currentSubscriber = markDirty;
try {
cached = fn();
} finally {
currentSubscriber = null;
}
dirty = false;
};
compute();
return {
get: function () {
if (currentSubscriber !== null) {
listeners.add(currentSubscriber);
}
if (dirty) {
compute();
}
return cached;
}
};
}
const source = createSignal(1);
const left = createMemo(function () {
return source.get() * 10;
});
const right = createMemo(function () {
return source.get() * 100;
});
const snapshots = [];
createEffect(function () {
snapshots.push([left.get(), right.get()]);
});
console.log("Diamond armed: source -> left, right -> reader.");
function check(name, actual, expected) {
const pass = JSON.stringify(actual) === JSON.stringify(expected);
console.log((pass ? "PASS" : "FAIL") + " " + name);
return { name: name, pass: pass };
}
function runAllChecks() {
source.set(2);
const results = [
check("one initial run", snapshots.length >= 1 && snapshots[0], [10, 100]),
check("source change runs the effect twice more", snapshots.length, 3),
check("first rerun mixes new left with stale right", snapshots[1], [20, 100]),
check("second rerun converges", snapshots[2], [20, 200])
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
runChecksButton.addEventListener("click", runAllChecks);`
	}
};
