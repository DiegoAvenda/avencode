// Data-Driven Resume — Lesson 13: Integrative challenge: Filter, Search, Restore
export default {
	id: 13,
	title: 'Integrative challenge: Filter, Search, Restore',
	type: 'challenge',
	description: `**Integrative challenge.** Everything so far — data, functions, conditionals, DOM updates and events — now combines into three real features: filter by date, search by company or role, and restore the full view.\n\nYou are not following a step-by-step recipe for each card: the starter gives you the complete pattern once. Your job is to make the three controls work together without breaking the others, then add a fourth feature of your own.`,
	task: `1. Press Run and combine the controls: search "free" and toggle **Current only**.\n2. Press **Reset view** and confirm the list and the search box both return to their initial state.\n3. Search for something that matches nothing: the empty message names the term.\n4. Add a "sort by start year" control using the same state-and-re-render pattern. Do it without looking at the existing handlers.`,
	concept: `**\`filter()\` returns a new array** — it keeps the jobs whose callback returns \`true\` and never mutates the original data. \`includes()\` answers "does this string contain that substring?" and both sides must be lowercase to be fair. One state object, one \`renderJobs()\`, three controls: every control changes state and asks the same renderer to run again.`,
	whyItMatters: `This is the evaluation of the whole module in miniature: can you take a new requirement and turn it into data, a condition and a render — without copy-pasting the old feature? That ability, not memorised syntax, is what makes you employable.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 13</title>
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
<input id="search-input" class="search-input" type="search" placeholder="Search company or role" aria-label="Search experience" />
<button id="recent-btn" class="btn" type="button">Show current only</button>
<button id="reset-btn" class="btn btn-ghost" type="button">Reset view</button>
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

.btn-ghost {
	background: transparent;
	border: 1px solid #c7d0dd;
	color: #1c2430;
}

.btn-ghost:hover {
	background: #eef2f9;
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
		javascript: `// Data-Driven Resume — Lesson 13: Integrative challenge: Filter, Search, Restore
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com"
};

const experience = [
	{ company: "Teleperformance", position: "Subject Matter Expert", start: 2023, end: 2026 },
	{ company: "Villa la Valencia", position: "Front Desk Agent", start: 2022, end: 2023 },
	{ company: "Freelance", position: "Frontend Developer", start: 2024, end: null },
	{ company: "Acme Studio", position: "Junior Web Developer", start: 2021, end: 2022 }
];

const list = document.getElementById("experience-list");
const statusElement = document.getElementById("status");
const recentButton = document.getElementById("recent-btn");
const resetButton = document.getElementById("reset-btn");
const searchInput = document.getElementById("search-input");

let searchTerm = "";
let onlyRecent = false;

function isCurrent(job) {
	return job.end === null;
}

function formatPeriod(job) {
	if (isCurrent(job)) {
		return job.start + " — Present";
	}
	return job.start + " — " + job.end;
}

function getVisibleJobs() {
	return experience.filter(function (job) {
		const matchesText =
			searchTerm === "" ||
			job.company.toLowerCase().includes(searchTerm) ||
			job.position.toLowerCase().includes(searchTerm);
		const matchesRecent = !onlyRecent || isCurrent(job);
		return matchesText && matchesRecent;
	});
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
	const jobs = getVisibleJobs();

	if (jobs.length === 0) {
		list.innerHTML = '<p class="empty">No jobs match "' + searchTerm + '".</p>';
		statusElement.textContent = "0 of " + experience.length + " jobs shown.";
		return;
	}

	let html = "";
	for (const job of jobs) {
		html += createJobCard(job);
	}
	list.innerHTML = html;
	statusElement.textContent = jobs.length + " of " + experience.length + " jobs shown.";
}

function renderProfile(person) {
	document.getElementById("profile-name").textContent = person.name;
	document.getElementById("profile-role").textContent = person.role;
	document.getElementById("profile-email").textContent = person.email;
}

searchInput.addEventListener("input", function () {
	searchTerm = searchInput.value.trim().toLowerCase();
	renderJobs();
});

recentButton.addEventListener("click", function () {
	onlyRecent = !onlyRecent;
	recentButton.textContent = onlyRecent ? "Show all jobs" : "Show current only";
	recentButton.setAttribute("aria-pressed", String(onlyRecent));
	renderJobs();
});

resetButton.addEventListener("click", function () {
	searchTerm = "";
	onlyRecent = false;
	searchInput.value = "";
	recentButton.textContent = "Show current only";
	recentButton.setAttribute("aria-pressed", "false");
	renderJobs();
});

renderProfile(profile);
renderJobs();
`
	}
};
