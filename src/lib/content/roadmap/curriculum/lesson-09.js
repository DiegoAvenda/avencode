// Data-Driven Resume — Lesson 9: Loops That Render
export default {
	id: 9,
	title: 'Loops That Render',
	description: `One template for every card, one loop for every job. This lesson replaces the copy-paste from lesson 8 with a \`for...of\` loop that accumulates HTML into a string, then assigns it once.\n\nYou will also meet the classic \`for\` loop with an index — useful when you need the position of each job — and see why the two loops have different jobs even though both visit the same array.`,
	task: `1. Press Run: all jobs render from a single template.\n2. Add a third job to \`experience\` and confirm it appears without touching the rendering code.\n3. Extend the numeric \`for\` loop to print the company and the number of years for each job.\n4. Add the number of jobs to \`#status\` using \`experience.length\`.`,
	concept: `**Loop once, render all** — \`html += template\` grows a string, and the browser parses it once at the end. Use \`for...of\` when you need each item; use \`for (let index = 0; ...)\` when you need its position. Keep the loop's only job as "turn data into markup"; mixing in unrelated side effects makes it hard to reuse.`,
	whyItMatters: `This is the moment a resume stops being a page and becomes an application: content comes from data, and adding a job is a one-line data edit. Every list you have ever scrolled — feeds, search results, inboxes — is this exact pattern at a larger scale.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 9</title>
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
		javascript: `// Data-Driven Resume — Lesson 9: Loops That Render
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

document.getElementById("profile-name").textContent = profile.name;
document.getElementById("profile-role").textContent = profile.role;
document.getElementById("profile-email").textContent = profile.email;

console.log("Jobs with their index:");
for (let index = 0; index < experience.length; index++) {
	console.log(index + ": " + experience[index].company);
}

let html = "";
for (const job of experience) {
	html += \`
<article class="card">
<h3 class="card-title">\${job.position}</h3>
<p class="card-subtitle">\${job.company}</p>
<p class="card-meta">\${job.start} — \${job.end}</p>
</article>
\`;
}

const list = document.getElementById("experience-list");
list.innerHTML = html;

document.getElementById("status").textContent =
	experience.length + " jobs rendered from data. Add a job, change nothing else.";

console.log("Cards rendered: " + list.children.length);
`
	}
};
