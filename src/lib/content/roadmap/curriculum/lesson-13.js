// Skill Roadmap — Lesson 13: createEffect Replaces Manual Render
export default {
	id: 13,
	title: 'createEffect Replaces Manual Render',
	description: `An effect is a function that runs now and re-runs whenever a signal it read changes. Set \`currentSubscriber\` to the runner, call the function, clear it: every \`get\` inside subscribes the effect for free.\n\nThis lesson deletes a manual render. The counts view used to need an explicit call after every mutation; now one \`createEffect\` owns it, and the Done button only touches state. One view down, the rest in lesson 15.`,
	task: `1. Press Run, press Toggle done twice: the counts line follows with no render call in the listener.\n2. Delete the \`createEffect\` block and confirm the view freezes — then undo.\n3. In one sentence: who calls the render now?`,
	concept: `**Effects subscribe by reading** — the runner sets \`currentSubscriber\`, the body reads signals (each \`get\` records the runner), then the flag clears. Later \`set\` calls wake the runner and the body replays. Rendering becomes a side effect of state, not a chore after it.`,
	whyItMatters: `This is the exact inversion Part A was begging for: views declare what they read, and the engine decides when they run. The forgotten-call bug class dies here.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 13</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Effects Replace Renders</h1>
<div class="composer">
<button id="toggle-btn" class="btn" type="button">Toggle done</button>
</div>
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

.counts {
color: #1c2430;
font-size: 15px;
}

.status {
color: #5b6572;
font-size: 13px;
}`,
		javascript: `// Skill Roadmap — Lesson 13: createEffect Replaces Manual Render
const toggleButton = document.getElementById("toggle-btn");
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
const doneCount = createSignal(1);
const total = createSignal(4);
createEffect(function () {
counts.textContent = doneCount.get() + " of " + total.get() + " skills done";
console.log("Effect repainted the counts.");
});
toggleButton.addEventListener("click", function () {
if (doneCount.get() >= total.get()) {
doneCount.set(0);
} else {
doneCount.set(doneCount.get() + 1);
}
});
status.textContent = "No render call in the listener: the effect owns the view.";
console.log("Effect armed: change state and watch it repaint.");`
	}
};
