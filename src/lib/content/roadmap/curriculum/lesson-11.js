// Data-Driven Resume — Lesson 11: Conditional Logic
export default {
	id: 11,
	title: 'Conditional Logic',
	description: `Real resumes have special cases: a job that has not ended, a profile without an email, a list that is empty. This lesson adds **conditionals** — comparisons, \`&&\`, \`||\`, \`!\`, \`if\`, \`else if\` and \`else\` — inside the functions you already have.\n\nA current job is modelled with \`end: null\`. The rendering asks "is this job current?" and shows a badge instead of a fake year.`,
	task: `1. Press Run: the Freelance job shows a **Current** badge and "Present" instead of an end year.\n2. Set the email in \`profile\` to \`""\` and run: the header shows a fallback message.\n3. Change \`experience\` to an empty array and run: the empty state appears instead of a blank box.\n4. Add an \`else if\` for jobs that lasted one year or less and print a short note.`,
	concept: `**Booleans drive the UI** — \`job.end === null\` produces a boolean, and \`if\` chooses between two outputs. \`&&\` means both sides must be true, \`||\` means either, \`!\` flips. Keep conditions in small named functions like \`isCurrent(job)\` so the template reads like a sentence.`,
	whyItMatters: `Every "show this only when…" rule in every interface is this lesson. Writing the condition once, in a named function, prevents the classic bug where two views disagree about what "current" means.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 11</title>
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
		javascript: `// Data-Driven Resume — Lesson 11: Conditional Logic
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com",
	openToWork: true
};

const experience = [
	{
		company: "Teleperformance",
		position: "Subject Matter Expert",
		start: 2023,
		end: 2026,
		skills: ["training", "quality"]
	},
	{
		company: "Villa la Valencia",
		position: "Front Desk Agent",
		start: 2022,
		end: 2023,
		skills: ["customer service", "english"]
	},
	{
		company: "Freelance",
		position: "Frontend Developer",
		start: 2024,
		end: null,
		skills: ["html", "css", "javascript"]
	}
];

function isCurrent(job) {
	return job.end === null;
}

function formatPeriod(job) {
	if (isCurrent(job)) {
		return job.start + " — Present";
	}
	return job.start + " — " + job.end;
}

function renderProfile(person) {
	document.getElementById("profile-name").textContent = person.name;
	document.getElementById("profile-role").textContent = person.role;

	const emailElement = document.getElementById("profile-email");
	if (person.email !== "") {
		emailElement.textContent = person.email;
	} else {
		emailElement.textContent = "Email available on request";
	}

	if (person.openToWork) {
		console.log(person.name + " is open to work.");
	} else {
		console.log(person.name + " is not looking right now.");
	}
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

function renderJobs(jobs, container) {
	if (jobs.length === 0) {
		container.innerHTML = '<p class="empty">No experience to show yet.</p>';
		return 0;
	}

	let html = "";
	for (const job of jobs) {
		html += createJobCard(job);
	}
	container.innerHTML = html;
	return jobs.length;
}

renderProfile(profile);

const list = document.getElementById("experience-list");
const rendered = renderJobs(experience, list);

let currentJobs = 0;
for (const job of experience) {
	if (isCurrent(job)) {
		currentJobs = currentJobs + 1;
	}
}

let message = rendered + " jobs rendered.";
if (currentJobs === 1) {
	message = message + " 1 current role.";
} else if (currentJobs > 1) {
	message = message + " " + currentJobs + " current roles.";
}
document.getElementById("status").textContent = message;

console.log("Current jobs:", currentJobs);
`
	}
};
