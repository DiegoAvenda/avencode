// Skill Roadmap — Lesson 12: createSignal from Scratch
export default {
	id: 12,
	title: 'createSignal from Scratch',
	description: `A signal is a closure with a phone book: a private value plus a \`Set\` of subscriber callbacks, with \`get\`/\`set\` as the public face. Setting a new value rings every subscriber; setting the same value rings nobody.\n\n\`currentSubscriber\` is the quiet hero: while an effect or memo runs, it points at that computation, so \`get\` can subscribe it automatically. No manual wiring — reading is subscribing.`,
	task: `1. Press Run, press the button: the label climbs and the console logs each notification.\n2. Read \`set\`: explain why \`Object.is\` guards the notification loop.\n3. Subscribe a second callback that warns when the count passes 5, without touching the button code.`,
	concept: `**Signals notify, nothing else** — \`get\` reads (and subscribes whoever is running), \`set\` writes and wakes subscribers, \`subscribe\` adds a listener by hand. The \`Set\` keeps each subscriber once even if it reads ten signals. Everything reactive in the next lessons is these three verbs.`,
	whyItMatters: `This 20-line object is the atom of Solid, Svelte runes and every signals library: private value, subscriber set, change-only notification. You just built the primitive the industry converged on.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 12</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Signals from Scratch</h1>
<div class="counter">
<p id="count-label" class="counter-label">0</p>
<button id="count-btn" class="btn" type="button">Count</button>
</div>
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

.counter {
display: flex;
gap: 12px;
align-items: center;
margin-top: 12px;
}

.counter-label {
background: #fff;
border: 1px solid #e1e7f0;
border-radius: 8px;
font-size: 20px;
margin: 0;
min-width: 80px;
padding: 8px 12px;
text-align: center;
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
}`,
		javascript: `// Skill Roadmap — Lesson 12: createSignal from Scratch
const countLabel = document.getElementById("count-label");
const countButton = document.getElementById("count-btn");
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
const count = createSignal(0);
count.subscribe(function () {
console.log("Notified: count is now " + count.get());
});
countButton.addEventListener("click", function () {
count.set(count.get() + 1);
countLabel.textContent = String(count.get());
});
status.textContent = "One signal, one subscriber, zero manual renders.";
console.log("Signal ready with value " + count.get() + ".");`
	}
};
