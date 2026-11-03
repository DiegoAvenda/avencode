// Data-Driven Resume — Lesson 6: Debugging Fundamentals
export default {
	id: 6,
	title: 'Debugging Fundamentals',
	description: `Something will always be wrong: a typo, a missing property, a value with the wrong type. This lesson keeps the resume in the console but turns you into a reader of evidence — \`console.log\`, \`console.warn\`, \`console.error\`, \`try/catch\` and breakpoints.\n\nThe starter contains one harmless typo on purpose (\`profile.nmae\`) and one caught error. Neither crashes the page; both are there to show you what a debugging session looks like.`,
	task: `1. Press Run and read every console message.\n2. Open the browser DevTools (F12), then the Console tab, and find the same messages there.\n3. Uncomment \`// debugger;\`, open DevTools, press Run and inspect \`jobs\` while execution is paused.\n4. Fix the \`nmae\` typo, run again and watch the warning become a real value.`,
	concept: `**Errors are information, not failure** — a syntax error stops parsing; a reference error means a name does not exist; a type error means you asked a value to do something it cannot. \`console.log\` shows values, \`try/catch\` contains failures, and a \`debugger\` statement freezes time so you can inspect every variable.`,
	whyItMatters: `Professionals do not write fewer bugs; they find them faster. Reading the console and pausing execution are the two skills that turn a 20-minute guess into a 20-second answer.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 6</title>
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
<h2 id="about-title" class="section-title">Debug console</h2>
<p class="placeholder">Open the console below the preview.</p>
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

.placeholder {
	color: #5b6572;
	font-size: 14px;
	margin: 0;
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
		javascript: `// Data-Driven Resume — Lesson 6: Debugging Fundamentals
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com"
};

const experience = [
	{ company: "Teleperformance", position: "Subject Matter Expert", start: 2023, end: 2026 },
	{ company: "Villa la Valencia", position: "Front Desk Agent", start: 2022, end: 2023 }
];

function totalYears(jobs) {
	let years = 0;
	for (const job of jobs) {
		years = years + (job.end - job.start);
	}
	return years;
}

console.log("Name:", profile.name);
console.warn("Typo check:", profile.nmae);
console.log("Jobs loaded:", experience.length);
console.log("Total years:", totalYears(experience));

try {
	const broken = JSON.parse("{ not json }");
	console.log(broken);
} catch (error) {
	console.error("Caught a parse error: " + error.message);
}

// Uncomment the next line, open DevTools and press Run to pause here.
// debugger;
`
	}
};
