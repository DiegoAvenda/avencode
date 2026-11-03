// Data-Driven Resume — Lesson 15: Deploy Your Resume
export default {
	id: 15,
	title: 'Deploy Your Resume',
	description: `The resume works, prints and responds. The last step is to put it on the internet and keep it there with version control. This lesson adds a deployment checklist rendered from a JavaScript array — the same data-first pattern, used to ship rather than to display.\n\nGit records versions locally; GitHub hosts the repository; GitHub Pages or Vercel turns it into a public URL. The starter also keeps the before-print safeguard, because a printed copy must never be filtered.`,
	task: `1. Press Run and read the checklist: three steps are already done, two are not.\n2. Set \`done: true\` on the steps you complete and watch the list update.\n3. Add the education section the final challenge asks for: write \`createEducationCard\` and \`renderEducation\` yourself — do not copy the experience implementation line by line.\n4. Create a repository, push the three files, publish, and replace the placeholder URL in the footer with your public one.`,
	concept: `**Local and production are different environments** — locally you open a file with \`file://\` or a dev server; in production a static host serves the same three files over HTTPS. Git tracks snapshots (\`add\`, \`commit\`, \`push\`), and a static host such as GitHub Pages or Vercel turns the latest commit into a public URL. The checklist is data: status lives in objects, and the same loop-and-render pattern turns it into the UI.`,
	whyItMatters: `A project that only exists on your laptop cannot be evaluated by anyone else. Deploying is the moment your work becomes evidence: a URL you can send, a repository a recruiter can read and a commit history that shows how you think.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 15</title>
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
<label class="sr-only" for="search-input">Search experience</label>
<input id="search-input" class="search-input" type="search" placeholder="Search company or role" />
<button id="recent-btn" class="btn" type="button" aria-pressed="false">Show current only</button>
<button id="reset-btn" class="btn btn-ghost" type="button">Reset view</button>
</div>
<div id="experience-list" class="card-list"></div>
</section>
<section class="resume-section" aria-labelledby="ship-title">
<h2 id="ship-title" class="section-title">Ship checklist</h2>
<ul id="ship-list" class="checklist"></ul>
<p class="checklist-note">Edit deploymentSteps in app.js as you finish each step.</p>
</section>
<p id="status" class="status" aria-live="polite"></p>
</main>
<footer class="resume-footer">
<p class="footer-text">Built with HTML, CSS and JavaScript.</p>
<p class="footer-text">Public URL: <span id="public-url">not published yet</span></p>
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
	margin-bottom: 20px;
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

.checklist {
	display: flex;
	flex-direction: column;
	gap: 6px;
	list-style: none;
	margin: 0;
	padding: 0;
}

.checklist-item {
	background: #fbfcfe;
	border: 1px solid #e1e7f0;
	border-radius: 8px;
	font-size: 14px;
	padding: 8px 12px;
}

.is-done {
	background: #ecfdf3;
	border-color: #12b76a;
	color: #166534;
}

.checklist-note {
	color: #5b6572;
	font-size: 12px;
	margin: 10px 0 0;
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
		margin: 0;
		padding: 0 0 16px;
	}

	.section-title {
		border-bottom-color: #000;
	}

	.card {
		break-inside: avoid;
		border: 1px solid #999;
	}

	.checklist,
	.checklist-note,
	.toolbar,
	.status,
	.resume-footer {
		display: none;
	}
}`,
		javascript: `// Data-Driven Resume — Lesson 15: Deploy Your Resume
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com"
};

const publicUrl = "your-name.github.io/resume";

const experience = [
	{ company: "Teleperformance", position: "Subject Matter Expert", start: 2023, end: 2026 },
	{ company: "Villa la Valencia", position: "Front Desk Agent", start: 2022, end: 2023 },
	{ company: "Freelance", position: "Frontend Developer", start: 2024, end: null },
	{ company: "Acme Studio", position: "Junior Web Developer", start: 2021, end: 2022 }
];

const deploymentSteps = [
	{ label: "Resume renders from JavaScript data", done: true },
	{ label: "Search, filter and restore work together", done: true },
	{ label: "Print view keeps every job", done: true },
	{ label: "Repository pushed to GitHub", done: false },
	{ label: "Site published and URL shared", done: false }
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

function renderChecklist() {
	let html = "";
	for (const step of deploymentSteps) {
		let itemClass = "checklist-item";
		let mark = "[ ]";
		if (step.done) {
			itemClass = "checklist-item is-done";
			mark = "[x]";
		}
		html += '<li class="' + itemClass + '">' + mark + " " + step.label + "</li>";
	}
	document.getElementById("ship-list").innerHTML = html;
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
renderChecklist();
document.getElementById("public-url").textContent = publicUrl;

console.log("Deployment checklist:", deploymentSteps);
`
	}
};
