// Data-Driven Resume — Lesson 4: Objects: Model Your Profile
export default {
	id: 4,
	title: 'Objects: Model Your Profile',
	description: `One variable per fact stops scaling immediately. This lesson groups your professional identity into a single **object**: properties with names, values with types, and a nested object for links.\n\nYou will read properties with dot notation and bracket notation, change them, add new ones and inspect the shape with \`Object.keys()\`. The page still does not change — the model is the deliverable.`,
	task: `1. Press Run and read the profile object printed in the console.\n2. Replace the values with your own name, role, location and links.\n3. Add a \`phone\` property using both dot notation and bracket notation.\n4. Change \`openToWork\` to \`false\` and print the whole object with \`console.log(profile)\`.`,
	concept: `**An object is a named record** — \`{ key: value }\` keeps related facts together. Dot notation (\`profile.name\`) is for fixed names; bracket notation (\`profile["role"]\`) is for dynamic keys, spaces or keys stored in a variable. \`const\` protects the binding, not the contents: adding or changing properties is allowed.`,
	whyItMatters: `Every API response, configuration file and component prop you will meet later is an object. Modelling your own information first — instead of copying a schema — teaches you to ask "what are the facts, and what are their names?" before writing a line of UI.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 4</title>
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
<p class="placeholder" data-empty="about">The profile object lives in app.js for now.</p>
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
		javascript: `// Data-Driven Resume — Lesson 4: Objects: Model Your Profile
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com",
	location: "Valencia, Spain",
	openToWork: true,
	links: {
		github: "github.com/diego",
		linkedin: "linkedin.com/in/diego"
	}
};

console.log("Name (dot): " + profile.name);
console.log("Role (brackets): " + profile["role"]);
console.log("GitHub (nested): " + profile.links.github);

profile.location = "Remote";
profile.availability = "Immediate";
profile["openToWork"] = false;

console.log("Keys: " + Object.keys(profile).join(", "));
console.log("Updated object:", profile);
`
	}
};
