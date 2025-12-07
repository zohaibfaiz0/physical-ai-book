---
id: 1
title: Create Constitution
stage: constitution
date: 2025-12-06
surface: agent
model: claude-haiku-4-5-20251001
feature: none
branch: master
user: AA
command: /sp.constitution
labels: [constitution,setup,initial]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```
/sp.constitution

Project: Living Book – "Physical AI and Humanoid Robotics: From Embodiment to Real-World Intelligence" with Embedded RAG Chatbot

Core principles:
- Maximum technical accuracy and depth (CS/robotics/engineering graduate level)
- Every factual claim 100% traceable to primary sources
- Zero hype, zero plagiarism
- Reproducibility of claims, code, and chatbot behavior
- Security-first (no hard-coded keys, env-only secrets)

Key standards:
- Citations: APA with clickable hyperlinks (DOI → arXiv → official reports → GitHub → patents → timestamped keynotes)
- Source mix: ≥ 60% peer-reviewed (ICRA, IROS, RSS, Science Robotics, TRO, CoRL, NeurIPS, etc.); ≤ 40% credible industry sources
- Code and datasets must be linked when publicly available
- Readability: Flesch-Kincaid Grade 11–13
- Plagiarism: 0% tolerance

Technical deliverables:
- Full book written in Docusaurus v3 MDX, deployed on GitHub Pages
- Embedded RAG chatbot (FastAPI + OpenAI Assistants + Neon pgvector + Qdrant Cloud free tier)
- Chatbot supports (a) whole-book questions and (b) questions on user-selected text only
- All backend code open-source, containerized, deployable on free tiers (Render/Vercel)

Constraints:
- Book length: 40,000–65,000 words
- Minimum 120 cited sources
- Chatbot latency < 600 ms on free tier
- Total external services: only OpenAI, Neon, Qdrant (all free tiers)

Success criteria:
- Book builds and deploys cleanly on GitHub Pages
- Every performance number or claim traceable in ≤ 2 clicks
- RAG chatbot answers book-only questions with ≥ 92% factual accuracy (manual eval on 50 test questions)
- Selected-text mode correctly ignores non-selected content
- Zero plagiarism (Turnitin or GPTZero clean)
- Passes review by at least one active researcher/engineer in humanoid robotics or embodied AI
- Entire repo remains publicly reproducible

This constitution governs the complete unified project (book + live RAG chatbot).
```

## Response snapshot

Created the project constitution file at `.specify/memory/constitution.md` with the following sections:
- Core Principles (Technical Accuracy and Depth, Source Traceability, Zero Hype and Zero Plagiarism, Reproducibility, Security-First Approach, Performance and Scalability)
- Additional Constraints (Book Requirements and Technical Deliverables)
- Development Workflow (Quality Standards and Implementation Requirements)
- Governance

The constitution incorporates all specified core principles and constraints for the Living Book project on Physical AI and Humanoid Robotics with an embedded RAG chatbot.

## Outcome

- ✅ Impact: Project constitution created with all specified principles and constraints
- 🧪 Tests: none
- 📁 Files: 1 created (.specify/memory/constitution.md)
- 🔁 Next prompts: Implement the book content and RAG chatbot
- 🧠 Reflection: Constitution successfully captures all core principles and constraints specified by the user

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Begin implementing the book content based on the constitution