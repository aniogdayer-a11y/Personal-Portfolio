# EduFocus web application stack

Verified against the owner's local EduFocus source, including the production copy. This describes EduFocus, independently of the React portfolio that presents it.

- `composer.json`: Laravel 12 and PHP 8.2 or newer.
- `resources/views/*.blade.php` and `resources/js/app.js`: Blade templates and JavaScript.
- `package.json` and `vite.config.js`: Tailwind CSS, Vite, npm, PDF.js, and Tesseract.js.
- `database/README.md`: the active application database is MySQL. SQLite is a supported local configuration, not the database credited in the portfolio.
- Composer manages PHP dependencies. The AI assistants already credited on the project page are development tools rather than application frameworks.

The portfolio's earlier React, TypeScript, and Node.js web-stack attribution has been replaced with the verified application stack. Node.js is used by the project tooling and PDF-processing utilities, but Laravel/PHP handles the web application's back end.
