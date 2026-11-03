// Data-Driven Resume — Lesson 7: Select Elements from the DOM
export default {
	id: 7,
	title: 'Select Elements from the DOM',
	description: `The browser turns your HTML into a tree of objects called the **DOM**, and JavaScript can hold references to any of those objects. This lesson selects the profile elements by \`id\`, stores the references in variables and writes real data into them with \`textContent\`.\n\nIt is the first time the page changes because of JavaScript — but note what did *not* change: the HTML still contains the containers, and the data still lives in its own object.`,
	task: `1. Press Run: the header shows Diego's profile instead of "Loading…".\n2. Change \`profile.name\` and \`profile.email\` and run again.\n3. Select \`#status\` with \`document.querySelector("#status")\` instead of \`getElementById\` and confirm it still works.\n4. Read the console: it prints the tag name of each selected element.`,
	concept: `**Selection returns an object, not a copy** — \`document.getElementById("profile-name")\` returns the live element; assigning \`textContent\` changes the page immediately. Keep the reference in a variable when you will use it more than once. \`querySelector\` takes any CSS selector; \`getElementById\` only takes an id and is slightly more direct.`,
	whyItMatters: `"Select, then update" is the whole manual DOM workflow. Every framework you meet later is an automation of exactly these two steps, so doing it by hand once makes the abstraction legible instead of magical.`,
	starterCode: {
		html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Data-Driven Resume — Lesson 7</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<header class="resume-header">
<h1 id="profile-name" class="resume-name">Loading…</h1>
<p id="profile-role" class="resume-role"></p>
<p class="resume-contact">
<span id="profile-email"></span> · <span id="profile-location"></span>
</p>
</header>
<main class="resume">
<section class="resume-section" aria-labelledby="about-title">
<h2 id="about-title" class="section-title">Profile</h2>
<p id="status" class="status" aria-live="polite">Waiting for JavaScript…</p>
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

.status {
	color: #5b6572;
	font-size: 13px;
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
		javascript: `// Data-Driven Resume — Lesson 7: Select Elements from the DOM
const profile = {
	name: "Diego",
	role: "Frontend Developer",
	email: "diego@example.com",
	location: "Valencia, Spain"
};

const nameElement = document.getElementById("profile-name");
const roleElement = document.getElementById("profile-role");
const emailElement = document.getElementById("profile-email");
const locationElement = document.getElementById("profile-location");
const statusElement = document.querySelector("#status");

console.log("Selected:", nameElement.tagName, roleElement.tagName);

nameElement.textContent = profile.name;
roleElement.textContent = profile.role;
emailElement.textContent = profile.email;
locationElement.textContent = profile.location;
statusElement.textContent = "Profile rendered from data.";

console.log("Status:", statusElement.textContent);
`
	}
};
