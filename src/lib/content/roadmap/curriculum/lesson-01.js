// Skill Roadmap — Lesson 1: Your First Roadmap
export default {
	id: 1,
	title: 'Your First Roadmap',
	description: `A roadmap is a map of skills, not a list of tasks. Press **Run** and read the console: the program reports how many skills sit on the map and the state of the first one.\n\nNothing on the page changes yet. That is the point: before drawing anything, you need a reliable way to see the data your app is about.`,
	task: `1. Press Run.\n2. Read the three messages in the console.\n3. Change one status word (for example \`"todo"\` to \`"done"\`) and run again.`,
	concept: `**Data first, pixels later** — the roadmap lives in an array of small objects, and every object has the same shape: \`{ id, title, status, prerequisites }\`. The page you will build in the next lessons is only ever a drawing of this array.`,
	whyItMatters: `Every app you will ever build is data plus a drawing of that data. Learning to inspect the data in the console before touching the page saves hours of guessing later.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skill Roadmap — Lesson 1</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<main class="app">
<h1 class="app-title">Your first roadmap</h1>
<p class="hint">Open the console to see the skill map report its contents.</p>
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
}

.hint {
color: #5b6572;
}

.roadmap {
display: grid;
gap: 8px;
margin-top: 16px;
}`,
		javascript: `// Skill Roadmap — Lesson 1: Your First Roadmap
const nodes = [
{ id: "html", title: "HTML Basics", status: "done", prerequisites: [] },
{ id: "css", title: "CSS Basics", status: "in-progress", prerequisites: ["html"] },
{ id: "js", title: "JS Basics", status: "todo", prerequisites: ["css"] }
];
console.log("Skills on the map: " + nodes.length);
console.log(nodes[0].title + " is " + nodes[0].status);
console.log("The map is an " + typeof nodes);`
	}
};
