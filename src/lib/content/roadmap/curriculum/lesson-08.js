// Data-Driven Resume — Lesson 8: Template Literals
export default {
	id: 8,
	title: 'Template Literals',
	description: `Text plus variables with \`+\` gets unreadable as soon as HTML is involved. **Template literals** use backticks and \`\${}\` interpolation, so a card can be written as the HTML it produces.\n\nThis lesson renders the profile and the first two experience cards with \`innerHTML\`. Write the same card twice by hand on purpose: the duplication is the setup for the loop in lesson 9.`,
	task: `1. Press Run: two job cards appear.\n2. Add a third job to the \`experience\` array and copy one card block for it (yes, manually).\n3. Add a \`skills\` line to the card template using \`job.skills.join(", ")\`.\n4. Read the console: it prints the generated HTML string before the browser parses it.`,
	concept: `**A template literal is a string with holes** — everything between \`\${}\` is evaluated as JavaScript and pasted into the text. \`element.innerHTML = htmlString\` parses that string into real elements. Because HTML is parsed, interpolated text is *markup*, not plain text — never paste untrusted input into \`innerHTML\` without escaping it first.`,
	whyItMatters: `Template literals are the bridge between data and markup: readable enough to see the shape of the output, powerful enough to generate any card. The security note matters from day one — this is how injection bugs are born.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 8</title>
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
		javascript: `// Data-Driven Resume — Lesson 8: Template Literals
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
	}
];

document.getElementById("profile-name").textContent = profile.name;
document.getElementById("profile-role").textContent = profile.role;
document.getElementById("profile-email").textContent = profile.email;

const list = document.getElementById("experience-list");
const firstJob = experience[0];
const secondJob = experience[1];

const firstCard = \`
<article class="card">
<h3 class="card-title">\${firstJob.position}</h3>
<p class="card-subtitle">\${firstJob.company}</p>
<p class="card-meta">\${firstJob.start} — \${firstJob.end}</p>
</article>
\`;

const secondCard = \`
<article class="card">
<h3 class="card-title">\${secondJob.position}</h3>
<p class="card-subtitle">\${secondJob.company}</p>
<p class="card-meta">\${secondJob.start} — \${secondJob.end}</p>
</article>
\`;

list.innerHTML = firstCard + secondCard;
document.getElementById("status").textContent = "Two cards written by hand. Lesson 9 removes the copy-paste.";

console.log("Generated HTML:", list.innerHTML);
console.log("Cards rendered: " + list.children.length);
`
	}
};
