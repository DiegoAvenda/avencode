// Data-Driven Resume — Lesson 1: Semantic HTML Bones
export default {
	id: 1,
	title: 'Semantic HTML Bones',
	description: `Every resume starts as a skeleton: a header, a few sections and containers that will later be filled by JavaScript. This lesson builds that skeleton with **semantic HTML** — tags that describe what the content *is*, not how it looks.\n\nThose containers start deliberately empty. The page you see is the frame; the data arrives in Phase 2 and the rendering in Phase 3.`,
	task: `1. Press Run and compare the page with the HTML tab.\n2. Find the three empty containers: \`about\`, \`experience-list\` and \`education-list\`.\n3. Read the console: it counts the semantic sections and the containers waiting for data.\n4. Change the name and role in the header, then write your own email and GitHub handle.`,
	concept: `**Structure before styling** — \`header\`, \`main\`, \`section\` and \`footer\` tell the browser (and screen readers) what each block means. A \`section\` with an \`aria-labelledby\` pointing at its heading becomes a real landmark, and the empty \`div\`s are not decoration: they are the targets JavaScript will fill later.`,
	whyItMatters: `Semantic HTML is the cheapest accessibility win you will ever get, and a good structure makes every later step easier: if the bones are wrong, no amount of CSS or JavaScript can fix them.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 1</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<header class="resume-header">
<h1 class="resume-name">Your Name</h1>
<p class="resume-role">Frontend Developer</p>
<p class="resume-contact">you@example.com · github.com/you</p>
</header>
<main class="resume">
<section class="resume-section" aria-labelledby="about-title">
<h2 id="about-title" class="section-title">About</h2>
<p class="placeholder" data-empty="about">This section will be generated from JavaScript.</p>
</section>
<section class="resume-section" aria-labelledby="experience-title">
<h2 id="experience-title" class="section-title">Experience</h2>
<div id="experience-list" class="card-list" data-empty="experience"></div>
</section>
<section class="resume-section" aria-labelledby="education-title">
<h2 id="education-title" class="section-title">Education</h2>
<div id="education-list" class="card-list" data-empty="education"></div>
</section>
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
	margin: 0;
}

.resume-header {
	background: #101828;
	color: #fff;
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 32px 16px;
	text-align: center;
}

.resume-name {
	font-size: 30px;
	margin: 0;
}

.resume-role {
	color: #7dd3fc;
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
	padding: 24px 16px;
}

.resume-section {
	margin-bottom: 28px;
}

.section-title {
	border-bottom: 2px solid #2563eb;
	font-size: 18px;
	margin: 0 0 12px;
	padding-bottom: 6px;
	text-transform: uppercase;
}

.placeholder {
	color: #5b6572;
	font-size: 14px;
}

.card-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.resume-footer {
	border-top: 1px solid #d7dee9;
	padding: 16px;
	text-align: center;
}

.footer-text {
	color: #5b6572;
	font-size: 12px;
	margin: 0;
}`,
		javascript: `// Data-Driven Resume — Lesson 1: Semantic HTML Bones
const sections = document.querySelectorAll("section");
const containers = document.querySelectorAll("[data-empty]");
console.log("Semantic sections: " + sections.length);
console.log("Containers waiting for data: " + containers.length);
console.log("Bones ready. The skin comes in lesson 2.");
`
	}
};
