// Data-Driven Resume — Lesson 10: Functions: Name the Steps
export default {
	id: 10,
	title: 'Functions: Name the Steps',
	description: `The script works, but it is one long run-on sentence. This lesson names each step: \`renderProfile\`, \`formatPeriod\`, \`createJobCard\` and \`renderJobs\`. Each function takes what it needs as a parameter and returns what it produces.\n\nThe page looks the same. That is the point: good refactors change the shape of the code, not the shape of the output.`,
	task: `1. Press Run and confirm the resume still renders exactly as in lesson 9.\n2. Change \`formatPeriod\` to return only the start year and run again.\n3. Change \`formatPeriod\` to accept two numbers instead of a job object, then update its caller.\n4. Read the console: \`renderJobs\` returns how many cards it rendered.`,
	concept: `**A function is a named, reusable step** — parameters are the inputs, \`return\` is the output, and local variables live only inside the body. Splitting \`renderJobs\` (orchestration) from \`createJobCard\` (one item) means a bug in one card has exactly one place to live. Functions should do one thing and say so in their name.`,
	whyItMatters: `You will read far more code than you write. Named steps are the difference between "something is broken somewhere" and "the period formatter is wrong". This is also the exact shape of the components and helpers you will use in every framework.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 10</title>
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
		javascript: `// Data-Driven Resume — Lesson 10: Functions: Name the Steps
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com"
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
		end: 2026,
		skills: ["html", "css", "javascript"]
	}
];

function renderProfile(person) {
	document.getElementById("profile-name").textContent = person.name;
	document.getElementById("profile-role").textContent = person.role;
	document.getElementById("profile-email").textContent = person.email;
}

function formatPeriod(job) {
	return job.start + " — " + job.end;
}

function createJobCard(job) {
	return \`
<article class="card">
<h3 class="card-title">\${job.position}</h3>
<p class="card-subtitle">\${job.company}</p>
<p class="card-meta">\${formatPeriod(job)}</p>
<p class="card-meta">Skills: \${job.skills.join(", ")}</p>
</article>
\`;
}

function renderJobs(jobs, container) {
	let html = "";
	for (const job of jobs) {
		html += createJobCard(job);
	}
	container.innerHTML = html;
	return jobs.length;
}

function countSkills(jobs) {
	let total = 0;
	for (const job of jobs) {
		total = total + job.skills.length;
	}
	return total;
}

renderProfile(profile);

const list = document.getElementById("experience-list");
const rendered = renderJobs(experience, list);
const skills = countSkills(experience);

document.getElementById("status").textContent =
	rendered + " jobs rendered by functions, " + skills + " skills in total.";

console.log("renderJobs returned:", rendered);
console.log("countSkills returned:", skills);
// console.log(total); // ReferenceError: total only exists inside countSkills.
`
	}
};
