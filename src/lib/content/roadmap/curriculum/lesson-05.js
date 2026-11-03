// Data-Driven Resume — Lesson 5: Arrays of Objects
export default {
	id: 5,
	title: 'Arrays of Objects',
	description: `Your resume has more than one job, more than one course and more than one project. An **array of objects** is the structure that holds them all, in order, without inventing a variable per entry.\n\nThis lesson models experience, education and projects, then reads them by index and by \`length\`. Each job also carries an array of skills, so you can see that structures nest.`,
	task: `1. Press Run and read the table of jobs in the console.\n2. Add a third job at the end of \`experience\`.\n3. Print the company of the last job using \`experience[experience.length - 1].company\`.\n4. Add one skill to the first job and re-run.`,
	concept: `**Arrays are ordered, objects are named** — \`experience[0]\` is the first item, \`experience.length\` is how many there are, and the last index is always \`length - 1\`. An array of objects combines the two: position gives you order, properties give you meaning. \`console.log()\` shows the whole collection in the console.`,
	whyItMatters: `Lists of records are everywhere: messages, products, search results, users. Once your data is an array of objects, every later tool — loops, \`filter()\`, rendering — has the shape it expects.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 5</title>
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
<p class="placeholder" data-empty="about">The resume data lives in app.js for now.</p>
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
		javascript: `// Data-Driven Resume — Lesson 5: Arrays of Objects
const experience = [
	{
		company: "Teleperformance",
		position: "Subject Matter Expert",
		start: 2023,
		end: 2026,
		skills: ["training", "quality", "communication"]
	},
	{
		company: "Villa la Valencia",
		position: "Front Desk Agent",
		start: 2022,
		end: 2023,
		skills: ["customer service", "english"]
	}
];

const education = [
	{
		school: "Online Campus",
		program: "Frontend Development",
		start: 2024,
		end: 2026
	}
];

const projects = [
	{
		name: "Data-Driven Resume",
		technologies: ["HTML", "CSS", "JavaScript"]
	}
];

console.log("Experience:", experience);
console.log("Jobs: " + experience.length);
console.log("Education entries: " + education.length);
console.log("Projects: " + projects.length);
console.log("First job: " + experience[0].company);
console.log("Last job: " + experience[experience.length - 1].company);
console.log("First job skills: " + experience[0].skills.join(", "));
`
	}
};
