// Skill Roadmap — Lesson 11: Closures and Callbacks
export default {
	id: 11,
	title: 'Closures and Callbacks',
	description: `Part B starts with the only new idea it needs: a **closure** — a function that remembers the variables where it was born. \`makeCounter\` builds counters that each keep their own private \`value\`; no globals, no sharing, no interference.\n\nCallbacks are the other half: you hand a function to a button (or, next lesson, to a signal) and it runs later. Closures plus callbacks are the entire machinery signals are built from.`,
	task: `1. Press Run, press both buttons: each counter climbs on its own.\n2. Add a third counter starting at 1000 with two lines, no new globals.\n3. Explain out loud: where does each \`value\` live after \`makeCounter\` returns?`,
	concept: `**A closure keeps its birthplace** — when \`makeCounter\` returns its inner function, the inner \`value\` variable stays alive inside it. Two calls make two independent cells. Signals (lesson 12) are this trick plus a subscriber list: private value, public get/set, callbacks on change.`,
	whyItMatters: `Private state without objects or classes: counters, id generators, subscribers, memos — every piece of the coming engine is a closure holding something. Learn the shape once, recognise it four times.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 11</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Closures and Callbacks</h1>
<div class="counter">
<p id="count-label" class="counter-label">0</p>
<button id="count-btn" class="btn" type="button">Count A</button>
</div>
<div class="counter">
<p id="other-label" class="counter-label">100</p>
<button id="other-btn" class="btn" type="button">Count B</button>
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
		javascript: `// Skill Roadmap — Lesson 11: Closures and Callbacks
const countLabel = document.getElementById("count-label");
const countButton = document.getElementById("count-btn");
const otherLabel = document.getElementById("other-label");
const otherButton = document.getElementById("other-btn");
const status = document.getElementById("status");
function makeCounter(start) {
let value = start;
return function () {
value = value + 1;
return value;
};
}
const countA = makeCounter(0);
const countB = makeCounter(100);
countButton.addEventListener("click", function () {
const value = countA();
countLabel.textContent = String(value);
console.log("Counter A: " + value);
});
otherButton.addEventListener("click", function () {
const value = countB();
otherLabel.textContent = String(value);
console.log("Counter B: " + value);
});
status.textContent = "Two counters, zero shared state.";
console.log("A and B remember separately: closures at work.");`
	}
};
