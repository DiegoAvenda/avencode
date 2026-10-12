// Quick Notes — Lesson 2: HTML Semantics for Notes
export default {
	id: 2,
	title: 'HTML Semantics for Notes',
	description: `The notes app needs a skeleton before it can do anything: a place to write, a button to confirm, and a container where notes will appear.\n\nThat skeleton is three elements with three stable ids: a \`textarea#note-input\` for writing, a \`button#add-btn\` for confirming, and a \`section#notes\` where notes will be rendered. Semantic tags (\`main\`, \`textarea\`, \`button\`, \`section\`) tell the browser — and assistive technology — what each part *is*, not just how it looks.`,
	task: `1. Press Run and read the console: the script finds all three elements.\n2. Type in the box. Nothing happens yet — that open question drives the next lessons.\n3. Open the HTML tab and match each id to the element that carries it.`,
	concept: `**Ids are the contract between HTML and JavaScript.** An \`id\` names one element on the page; \`document.getElementById\` looks it up by that name. If the id in the script does not exist in the markup, the lookup returns \`null\` — most early DOM bugs are exactly that mismatch.`,
	whyItMatters: `JavaScript can only touch what it can find. A page with clear semantics and stable ids is scriptable; a page of anonymous \`div\` elements is not. Every later lesson reaches the page through these three ids.`,
	starterCode: {
		html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<title>Quick Notes — Lesson 2</title>\n<link rel="stylesheet" href="style.css" />\n</head>\n<body>\n<main class="app">\n<h1 class="app-title">Quick Notes</h1>\n<div class="composer">\n<textarea id="note-input" class="note-input" placeholder="Write a note..."></textarea>\n<button id="add-btn" class="btn" type="button">Add Note</button>\n</div>\n<section id="notes" class="notes" aria-label="Notes"></section>\n</main>\n<script src="app.js"></script>\n</body>\n</html>`,
		css: `body {\nbackground: #f4f6fb;\ncolor: #1c2430;\nfont-family: system-ui, sans-serif;\nmargin: 0;\n}\n\n.app {\nmargin: 32px auto;\nmax-width: 640px;\npadding: 0 16px;\n}\n\n.app-title {\nfont-size: 28px;\n}\n\n.composer {\nmargin-top: 16px;\n}\n\n.note-input {\nmin-height: 64px;\nwidth: 100%;\n}\n\n.btn {\ncursor: pointer;\nmargin-top: 8px;\n}\n\n.notes {\nmargin-top: 16px;\n}`,
		javascript: `// Quick Notes — Lesson 2: HTML Semantics for Notes\nconst input = document.getElementById("note-input");\nconst addButton = document.getElementById("add-btn");\nconst notesSection = document.getElementById("notes");\nconsole.log(input.placeholder);\nconsole.log(addButton.textContent);\nconsole.log(notesSection.children.length);`
	}
};
