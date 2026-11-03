// Data-Driven Resume — Lesson 12: Events and DOM Updates
export default {
	id: 12,
	title: 'Events and DOM Updates',
	description: `The resume is dynamic but passive: it renders once and waits. This lesson makes it **react** to the user with \`addEventListener()\`. A click toggles "current jobs only", and typing in the search box updates the status line on every keystroke.\n\nThe search box does not filter yet — lesson 13 connects it. Here the goal is to understand the event, the handler and the re-render.`,
	task: `1. Press Run and click **Show current only**: the list re-renders with one card.\n2. Type in the search box and watch the status line update on every character.\n3. Add a second button that restores the full list in one click.\n4. Read the console: every input event prints the current search term.`,
	concept: `**An event is a moment, a handler is the response** — \`addEventListener("click", handler)\` registers a function to run when the click happens. State lives in variables (\`onlyRecent\`, \`searchTerm\`); the handler changes the state and then calls \`renderJobs()\` to rebuild the list. The DOM is never edited in place; it is cleared and regenerated from the current state.`,
	whyItMatters: `This "state changes, then re-render" loop is the core of every interactive app. Doing it manually once — including the bug-prone parts — is what makes reactive frameworks feel like a shortcut instead of a mystery.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 12</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<header class="resume-header">
<h1 id="profile-name" class="resume-name"></h1>
<p id="profile-role" class="resume-role"></p>
<p class="resume-contact"><span id="profile-email"></span></p>
</header>
<main class="resume">
<section class="resume-section" aria-labelledby="experience-title">
<h2 id="experience-title" class="section-title">Experience</h2>
<div class="toolbar">
<input id="search-input" class="search-input" type="search" placeholder="Search (lesson 13 connects this)" />
<button id="recent-btn" class="btn" type="button">Show current only</button>
</div>
<div id="experience-list" class="card-list"></div>
</section>
<p id="status" class="status" aria-live="polite"></p>
</main>
<footer class="resume-footer">
<p class="footer-text">Built with HTML, CSS and JavaScript.</p>
</footer>
<script src="app.js"></script>
</body>
</html>`,
		css: `body {
	background: #f4f6fb;
	color: #1c2430;
	font-family: system-ui, sans-serif;
	line-height: 1.5;
	margin: 0;
}

.resume-header {
	background: #101828;
	color: #fff;
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 36px 20px;
	text-align: center;
}

.resume-name {
	font-size: 32px;
	margin: 0;
}

.resume-role {
	color: #7dd3fc;
	font-weight: 600;
	margin: 0;
}

.resume-contact {
	color: #94a3b8;
	font-size: 13px;
	margin: 0;
}

.resume {
	margin: 0 auto;
	max-width: 720px;
	padding: 28px 20px;
}

.resume-section {
	background: #fff;
	border: 1px solid #e1e7f0;
	border-radius: 12px;
	padding: 18px 20px;
}

.section-title {
	border-bottom: 2px solid #2563eb;
	font-size: 16px;
	letter-spacing: 1px;
	margin: 0 0 14px;
	padding-bottom: 6px;
	text-transform: uppercase;
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 12px;
}

.search-input {
	border: 1px solid #c7d0dd;
	border-radius: 8px;
	flex: 1;
	font: inherit;
	min-width: 180px;
	padding: 8px 12px;
}

.btn {
	background: #2563eb;
	border: none;
	border-radius: 8px;
	color: #fff;
	cursor: pointer;
	font: inherit;
	padding: 9px 14px;
}

.btn:hover {
	background: #1d4ed8;
}

.card-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.card {
	background: #fbfcfe;
	border: 1px solid #e1e7f0;
	border-radius: 10px;
	padding: 14px 16px;
}

.card-title {
	font-size: 16px;
	margin: 0;
}

.card-subtitle {
	color: #2563eb;
	font-weight: 600;
	margin: 2px 0 0;
}

.card-meta {
	color: #5b6572;
	font-size: 12px;
	margin: 6px 0 0;
}

.tag {
	background: #dcfce7;
	border-radius: 999px;
	color: #166534;
	font-size: 11px;
	font-weight: 700;
	padding: 2px 8px;
	text-transform: uppercase;
}

.empty {
	color: #5b6572;
	font-style: italic;
	margin: 0;
}

.status {
	color: #5b6572;
	font-size: 13px;
	margin: 14px 0 0;
}

.resume-footer {
	border-top: 1px solid #d7dee9;
	padding: 18px;
	text-align: center;
}

.footer-text {
	color: #5b6572;
	font-size: 12px;
	margin: 0;
}`,
		javascript: `// Data-Driven Resume — Lesson 12: Events and DOM Updates
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com"
};

const experience = [
	{ company: "Teleperformance", position: "Subject Matter Expert", start: 2023, end: 2026 },
	{ company: "Villa la Valencia", position: "Front Desk Agent", start: 2022, end: 2023 },
	{ company: "Freelance", position: "Frontend Developer", start: 2024, end: null }
];

const list = document.getElementById("experience-list");
const statusElement = document.getElementById("status");
const recentButton = document.getElementById("recent-btn");
const searchInput = document.getElementById("search-input");

let onlyRecent = false;
let searchTerm = "";

function isCurrent(job) {
	return job.end === null;
}

function formatPeriod(job) {
	if (isCurrent(job)) {
		return job.start + " — Present";
	}
	return job.start + " — " + job.end;
}

function createJobCard(job) {
	let badge = "";
	if (isCurrent(job)) {
		badge = '<span class="tag">Current</span>';
	}

	return \`
<article class="card">
<h3 class="card-title">\${job.position}</h3>
<p class="card-subtitle">\${job.company}</p>
<p class="card-meta">\${formatPeriod(job)} \${badge}</p>
</article>
\`;
}

function renderJobs() {
	let html = "";
	for (const job of experience) {
		if (onlyRecent && !isCurrent(job)) {
			continue;
		}
		html += createJobCard(job);
	}

	if (html === "") {
		list.innerHTML = '<p class="empty">No jobs match the current view.</p>';
	} else {
		list.innerHTML = html;
	}
}

function updateStatus() {
	if (searchTerm === "") {
		statusElement.textContent = "Type in the box: lesson 13 will filter with that term.";
	} else {
		statusElement.textContent = 'Search term ready: "' + searchTerm + '"';
	}
}

recentButton.addEventListener("click", function () {
	onlyRecent = !onlyRecent;
	recentButton.textContent = onlyRecent ? "Show all jobs" : "Show current only";
	recentButton.setAttribute("aria-pressed", String(onlyRecent));
	renderJobs();
	console.log("click event: onlyRecent =", onlyRecent);
});

searchInput.addEventListener("input", function () {
	searchTerm = searchInput.value.trim();
	updateStatus();
	console.log("input event:", searchTerm);
});

document.getElementById("profile-name").textContent = profile.name;
document.getElementById("profile-role").textContent = profile.role;
document.getElementById("profile-email").textContent = profile.email;

renderJobs();
updateStatus();
`
	}
};
