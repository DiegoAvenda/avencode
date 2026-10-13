// Skill Roadmap — Lesson 14: createMemo: Derive, Do Not Recompute
export default {
	id: 14,
	title: 'createMemo: Derive, Do Not Recompute',
	description: `Effects re-run; memos remember. A memo computes once, caches the value, and recomputes only after a dependency notifies it — while notifying its own readers in turn. Status labels and progress percents stop being recomputed on every read and become cached derivations.\n\nThe console proves the caching: repeated reads log one computation, a state change logs exactly one more. This is lesson 3's \`getStatus\`, graduated from "compute every time" to "compute on change".`,
	task: `1. Press Run: one computation for two reads — check the console.\n2. Toggle twice: each change recomputes exactly once.\n3. Explain why the memo sets a dirty flag instead of recomputing immediately when notified.`,
	concept: `**Memos cache between changes** — a dirty flag plus a cached value: \`get\` recomputes only when dirty, notifications only set the flag and wake readers. Readers pull fresh values lazily instead of the memo pushing eagerly. Derived state stays correct and cheap at any graph size.`,
	whyItMatters: `Without memos every effect recomputes every derivation on every change — quadratic pain in disguise. Memos are how reactive systems stay fast: compute on change, serve from cache otherwise.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 14</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Memos Remember</h1>
<div class="composer">
<button id="toggle-btn" class="btn" type="button">Toggle done</button>
</div>
<p id="memo-label" class="memo-label"></p>
<p id="counts" class="counts"></p>
<p id="status" class="status"></p>
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

.memo-label {
background: #fff;
border: 1px solid #e1e7f0;
border-radius: 8px;
padding: 8px 12px;
}

.counts {
color: #1c2430;
font-size: 15px;
}

.status {
color: #5b6572;
font-size: 13px;
}`,
		javascript: `// Skill Roadmap — Lesson 14: createMemo: Derive, Do Not Recompute
const toggleButton = document.getElementById("toggle-btn");
const memoLabel = document.getElementById("memo-label");
const counts = document.getElementById("counts");
const status = document.getElementById("status");
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
},
subscribe: function (fn) {
subscribers.add(fn);
return function () {
subscribers.delete(fn);
};
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
let runs = 0;
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
runs = runs + 1;
console.log("Memo recomputed (" + runs + ").");
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
const doneCount = createSignal(1);
const total = createSignal(4);
const summary = createMemo(function () {
return doneCount.get() + " of " + total.get() + " skills done";
});
createEffect(function () {
memoLabel.textContent = summary.get();
counts.textContent = "Reads served from cache until state changes.";
});
toggleButton.addEventListener("click", function () {
if (doneCount.get() >= total.get()) {
doneCount.set(0);
} else {
doneCount.set(doneCount.get() + 1);
}
});
status.textContent = "Derived, cached, and recomputed only on change.";
console.log("First read: " + summary.get());
console.log("Second read (cached): " + summary.get());`
	}
};
