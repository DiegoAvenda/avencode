// Data-Driven Resume — Lesson 2: CSS and Flexbox Skin
export default {
	id: 2,
	title: 'CSS and Flexbox Skin',
	description: `The skeleton now gets a skin. This lesson styles the resume without touching its structure: typography, colours, spacing, the box model and **Flexbox** for the header and the card lists.\n\nThe layout is mobile-first and becomes slightly roomier on wide screens. Nothing here depends on JavaScript yet — which is exactly the point: a resume should look complete even before its data arrives.`,
	task: `1. Press Run and resize the preview: the header centres on small screens and aligns left on wide ones.\n2. Open the CSS tab and change the accent colour (\`#2563eb\`) in two places.\n3. Add a \`box-shadow\` to \`.resume-header\` and a \`border-radius\` to \`.card-list\`.\n4. Read the console to confirm the header is a Flexbox container and the page width.`,
	concept: `**The box model plus one axis** — every element is content, padding, border and margin. Flexbox lays children along one axis with \`display: flex\`, and \`gap\` replaces margin hacks. \`flex-direction: column\` stacks the header lines; \`justify-content\` and \`align-items\` decide how they sit on the other axis.`,
	whyItMatters: `Most "my layout is broken" bugs are really "I never decided which box owns the space". Flexbox gives you one predictable tool for rows and columns, and learning it with plain CSS means every framework later feels like a convenience, not magic.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 2</title>
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
	line-height: 1.5;
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
	letter-spacing: -0.5px;
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

.placeholder {
	color: #5b6572;
	font-size: 14px;
	margin: 0;
}

.card-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
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

@media (min-width: 640px) {
	.resume-header {
		align-items: flex-start;
		padding: 44px 32px;
		text-align: left;
	}

	.resume {
		padding: 36px 32px;
	}
}`,
		javascript: `// Data-Driven Resume — Lesson 2: CSS and Flexbox Skin
const header = document.querySelector(".resume-header");
const resume = document.querySelector(".resume");
const headerStyle = getComputedStyle(header);
console.log("Header display: " + headerStyle.display);
console.log("Header direction: " + headerStyle.flexDirection);
console.log("Resume width: " + resume.offsetWidth + "px");
console.log("Resize the preview: the skin adapts, the HTML does not.");
`
	}
};
