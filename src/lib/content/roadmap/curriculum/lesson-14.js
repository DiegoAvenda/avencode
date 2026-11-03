// Data-Driven Resume — Lesson 14: Print and Polish
export default {
	id: 14,
	title: 'Print and Polish',
	description: `A resume that only works on screen is half a resume. This lesson adds a **print stylesheet** with \`@media print\`, hides the toolbar and status line on paper, and makes sure a filtered list never prints an incomplete resume.\n\nIt also adds the accessibility details that screen readers need: a real \`label\` for the search field, \`aria-live\` on the status line and \`aria-pressed\` on the toggle.`,
	task: `1. Press Ctrl+P (or use the browser menu) and preview the printed page: no buttons, no search box.\n2. Filter to one job, then open the print preview again: all jobs are present.\n3. Temporarily remove \`break-inside: avoid\` from \`.card\` and compare page breaks.\n4. Check the search field with a screen reader or with the accessibility inspector in DevTools.`,
	concept: `**The same HTML, a different medium** — print is a second presentation, not a second page. \`@media print\` overrides colours, spacing and visibility without touching the data. \`beforeprint\` and \`afterprint\` let you temporarily clear the filters so paper always gets the complete record. Accessibility is the same idea: the markup should explain itself when pixels are not available.`,
	whyItMatters: `Recruiters still print resumes, and assistive technology reads the same page your users see. Shipping with print and accessibility considered is the difference between a demo and something you can actually send to a company.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 14</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<header class="resume-header">
<h1 id="profile-name" class="resume-name"></h1>
<p id="profile-role" class="resume-role"></p>
<p class="resume-contact"><span id="profile-email"></span></p>
</header>
<main class="resume">
<p class="print-hint">Tip: press Ctrl+P to see the print version.</p>
<section class="resume-section" aria-labelledby="experience-title">
<h2 id="experience-title" class="section-title">Experience</h2>
<div class="toolbar">
<label class="sr-only" for="search-input">Search experience</label>
<input id="search-input" class="search-input" type="search" placeholder="Search company or role" />
<button id="recent-btn" class="btn" type="button" aria-pressed="false">Show current only</button>
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

.print-hint {
	color: #5b6572;
	font-size: 12px;
	margin: 0 0 12px;
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
}

.sr-only {
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
}

@media print {
	body {
		background: #fff;
		color: #000;
	}

	.resume-header {
		background: #fff;
		color: #000;
		padding: 0 0 16px;
		text-align: left;
	}

	.resume-role,
	.resume-contact {
		color: #333;
	}

	.resume {
		max-width: none;
		padding: 0;
	}

	.resume-section {
		border: none;
		padding: 0 0 16px;
	}

	.section-title {
		border-bottom-color: #000;
	}

	.card {
		break-inside: avoid;
		border: 1px solid #999;
	}

	.toolbar,
	.status,
	.print-hint,
	.resume-footer {
		display: none;
	}
}`,
		javascript: `// Data-Driven Resume — Lesson 14: Print and Polish
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
	document.title = person.name + " — " + person.role;
}

let savedSearch = "";
let savedOnlyRecent = false;

window.addEventListener("beforeprint", function () {
	savedSearch = searchTerm;
	savedOnlyRecent = onlyRecent;
	searchTerm = "";
	onlyRecent = false;
	renderJobs();
	console.log("beforeprint: filters cleared for a complete resume.");
});

window.addEventListener("afterprint", function () {
	searchTerm = savedSearch;
	onlyRecent = savedOnlyRecent;
	recentButton.textContent = onlyRecent ? "Show all jobs" : "Show current only";
	recentButton.setAttribute("aria-pressed", String(onlyRecent));
	renderJobs();
});

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
