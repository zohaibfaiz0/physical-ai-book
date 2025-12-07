---
id: 2
title: Create Book Layout Spec
stage: spec
date: 2025-12-06
surface: agent
model: claude-haiku-4-5-20251001
feature: docusaurus-book-layout
branch: 1-docusaurus-book-layout
user: AA
command: /sp.specify
labels: [spec,documentation,docusaurus]
links:
  spec: specs/1-docusaurus-book-layout/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-docusaurus-book-layout/spec.md
 - specs/1-docusaurus-book-layout/checklists/requirements.md
 - docs/intro.mdx
 - docs/preface.mdx
 - docs/hardware-requirements.mdx
 - docs/chapters/01-weeks-1-2-foundations/index.mdx
 - docs/chapters/02-weeks-3-5-ros2/index.mdx
 - docs/chapters/03-weeks-6-7-simulation/index.mdx
 - docs/chapters/04-weeks-8-10-nvidia-isaac/index.mdx
 - docs/chapters/05-weeks-11-12-humanoid-development/index.mdx
 - docs/chapters/06-week-13-conversational-robotics/index.mdx
 - docs/chapters/appendices/index.mdx
 - docusaurus.config.js
 - sidebars.js
 - src/components/ChatBot.jsx
 - src/css/custom.css
 - package.json
 - tsconfig.json
 - README.md
tests:
 - none
---

## Prompt

```
/sp.specify Define final Docusaurus book layout and folder structure for Physical AI & Humanoid Robotics textbook

Use Docusaurus v3 classic + TypeScript.
Create the exact folder structure below and nothing else:

docs/
├── intro.mdx
├── preface.mdx
├── hardware-requirements.mdx
└── chapters/
    ├── 01-weeks-1-2-foundations/
    ├── 02-weeks-3-5-ros2/
    ├── 03-weeks-6-7-simulation/
    ├── 04-weeks-8-10-nvidia-isaac/
    ├── 05-weeks-11-12-humanoid-development/
    ├── 06-week-13-conversational-robotics/
    └── appendices/

Requirements:
- Auto-generated nested sidebar (exact folder names above become sidebar groups)
- Every chapter folder gets an index.mdx with this frontmatter:
  ---
  title: "Weeks X–Y – Module Name"
  description: Short tagline
  week: "Weeks X–Y"
  ---
- Enable Mermaid, dark mode, search, MDX v2
- Add placeholder <ChatBot /> component import in docs/intro.mdx
- Configure GitHub Pages deploy (baseUrl correct)
-
```

## Response snapshot

Created the complete Docusaurus book layout for the Physical AI & Humanoid Robotics textbook with:
- All required directory structure under docs/
- All MDX files with proper frontmatter
- Docusaurus configuration with auto-generated sidebar
- ChatBot component placeholder
- Package.json with Docusaurus dependencies
- TypeScript configuration
- Custom CSS and README files

Specification includes user stories for content navigation, chatbot interaction, and usability features with measurable success criteria.

## Outcome

- ✅ Impact: Complete Docusaurus book structure implemented
- 🧪 Tests: none
- 📁 Files: 19 created/modified
- 🔁 Next prompts: Plan implementation of RAG chatbot functionality
- 🧠 Reflection: Specification successfully captures all requirements for book layout

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Begin implementation of RAG chatbot