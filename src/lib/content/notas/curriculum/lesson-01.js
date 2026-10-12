// Quick Notes — Lesson 1: Run Your First Program
export default {
	id: 1,
	title: 'Run Your First Program',
	description: `A program is a list of instructions. Press **Run** to execute the instructions, then look at the console: it is where a program can report what it did.\n\nNothing on the page changes yet. That is the point: before building the notes app, you need a reliable way to see that your code ran at all.`,
	task: `1. Press Run.\n2. Read the three messages in the console.\n3. Change the word inside the quotes and run again.`,
	concept: `**Running code and the console** — JavaScript executes from top to bottom, and \`console.log\` prints a value to the console so you can inspect it. The page and the console are two different outputs; this lesson only uses the console.`,
	whyItMatters: `Before changing a program, you need a reliable way to see what it did. The console is that first feedback loop, and you will use it in every lesson that follows.`,
	starterCode: {
		html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<title>Quick Notes — Lesson 1</title>\n<link rel="stylesheet" href="style.css" />\n</head>\n<body>\n<main class="app">\n<h1 class="app-title">Your first program</h1>\n<p class="hint">Open the console to see the program report its work.</p>\n</main>\n<script src="app.js"></script>\n</body>\n</html>`,
		css: `body {\nbackground: #f4f6fb;\ncolor: #1c2430;\nfont-family: system-ui, sans-serif;\nmargin: 0;\n}\n\n.app {\nmargin: 32px auto;\nmax-width: 640px;\npadding: 0 16px;\n}\n\n.app-title {\nfont-size: 28px;\n}\n\n.hint {\ncolor: #5b6572;\n}`,
		javascript: `// Quick Notes — Lesson 1: Run Your First Program\nconsole.log("JavaScript is running");\nconst greeting = "Hello, notes!";\nconsole.log(greeting);\nconsole.log("The program finished");`
	}
};
