// Data-Driven Resume — Lesson 3: Variables and Data Types
export default {
	id: 3,
	title: 'Variables and Data Types',
	description: `The page still shows placeholders, but the JavaScript tab now holds your first real data. You will store text, numbers and true/false values in variables, print them with \`console.log()\` and watch how \`const\` and \`let\` differ.\n\nThis is the "data first" rule of the module: before a single character reaches the page, the information must exist in JavaScript.`,
	task: `1. Press Run and read every line in the console.\n2. Change \`name\`, \`role\` and \`email\` to your own details and run again.\n3. Change \`hourlyRate\` and \`hoursPerWeek\`, then predict \`weeklyTarget\` before running.\n4. Try uncommenting \`// name = "Someone else";\` and read the error in the console. Re-comment it before moving on.`,
	concept: `**\`const\` binds, \`let\` rebinds** — a \`const\` variable cannot point at a different value, but the object it points at can still be mutated (lesson 4). \`let\` is for values that will be replaced, like a counter. Strings, numbers, booleans, \`null\` and \`undefined\` are the primitive types this project uses, and \`typeof\` tells you which one you have.`,
	whyItMatters: `Nearly every bug starts with a value that is not what you think it is. Names, types and \`console.log()\` are the cheapest debugging tools you own, and they cost nothing to use from the first minute.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 3</title>
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
<p class="placeholder" data-empty="about">The profile data lives in app.js for now.</p>
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
		javascript: `// Data-Driven Resume — Lesson 3: Variables and Data Types
const name = "Diego";
const role = "Frontend Developer";
const email = "diego@example.com";
const yearsOfExperience = 3;
const openToWork = true;
const hourlyRate = 25;
const hoursPerWeek = 20;

let profileViews = 0;
profileViews = profileViews + 1;

const weeklyTarget = hourlyRate * hoursPerWeek;

console.log(name + " — " + role);
console.log("Email: " + email + " (" + typeof email + ")");
console.log("Years of experience: " + yearsOfExperience + " (" + typeof yearsOfExperience + ")");
console.log("Open to work: " + openToWork + " (" + typeof openToWork + ")");
console.log("Profile views: " + profileViews);
console.log("Weekly target: " + weeklyTarget);

// const prevents rebinding: uncomment to see the error.
// name = "Someone else";
`
	}
};
