<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-docs-rules -->
# Always consult project docs before editing code

Before making any code change, review relevant Markdown documents under `docs/`.
Treat `docs/**/*.md` as project requirements and implementation guidance.
When modifying code, ensure the change is consistent with those documents, including:

- `docs/API_Specification.md`
- `docs/DESIGN.md`
- `docs/Function_Specification.md`

If the requested change conflicts with the docs, call out the conflict explicitly and prefer updating the code in a way that matches the documented requirements unless the user asks to change the docs too.
<!-- END:project-docs-rules -->
