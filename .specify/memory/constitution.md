<!--
Sync Impact Report:
- Version change: N/A → 1.0.0
- Modified principles: Added 6 specific principles for the Living Book project
- Added sections: Core Principles, Additional Constraints, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates: N/A
- Follow-up TODOs: None
-->
# Living Book – "Physical AI and Humanoid Robotics: From Embodiment to Real-World Intelligence" with Embedded RAG Chatbot Constitution

## Core Principles

### Technical Accuracy and Depth
Every implementation and claim must meet graduate-level CS/robotics/engineering standards; All technical content must be rigorously accurate and reflect current state-of-the-art research; Depth over breadth in all technical discussions and implementations.

### Source Traceability
Every factual claim must be 100% traceable to primary sources; All information must be verifiable through direct citations; Zero tolerance for unsubstantiated claims or assertions without proper attribution.

### Zero Hype and Zero Plagiarism
All content must be presented without marketing language or unfounded claims; Strict adherence to factual, scientific presentation; Complete originality required with 0% plagiarism tolerance.

### Reproducibility
All claims, code, and chatbot behavior must be reproducible by others; Full documentation and code availability required; Transparent methodology and clear replication steps for all experiments and implementations.

### Security-First Approach
No hard-coded keys or secrets allowed; All sensitive information must be handled through environment variables only; Security considerations must be prioritized in all architectural decisions.

### Performance and Scalability
All implementations must meet specified performance criteria (e.g., chatbot latency < 600 ms on free tier); Solutions must be deployable on free tiers of target platforms; Resource efficiency and cost optimization are required.

## Additional Constraints

### Book Requirements
- Book length: 40,000–65,000 words
- Minimum 120 cited sources
- Citations: APA with clickable hyperlinks (DOI → arXiv → official reports → GitHub → patents → timestamped keynotes)
- Source mix: ≥ 60% peer-reviewed (ICRA, IROS, RSS, Science Robotics, TRO, CoRL, NeurIPS, etc.); ≤ 40% credible industry sources
- Code and datasets must be linked when publicly available
- Readability: Flesch-Kincaid Grade 11–13

### Technical Deliverables
- Full book written in Docusaurus v3 MDX, deployed on GitHub Pages
- Embedded RAG chatbot (FastAPI + OpenAI Assistants + Neon pgvector + Qdrant Cloud free tier)
- Chatbot supports (a) whole-book questions and (b) questions on user-selected text only
- All backend code open-source, containerized, deployable on free tiers (Render/Vercel)
- Total external services: only OpenAI, Neon, Qdrant (all free tiers)

## Development Workflow

### Quality Standards
- All code must pass review by at least one active researcher/engineer in humanoid robotics or embodied AI
- RAG chatbot answers book-only questions with ≥ 92% factual accuracy (manual eval on 50 test questions)
- Selected-text mode correctly ignores non-selected content
- Zero plagiarism (Turnitin or GPTZero clean)
- All implementations must be publicly reproducible

### Implementation Requirements
- Every performance number or claim traceable in ≤ 2 clicks
- Book builds and deploys cleanly on GitHub Pages
- All changes must be small, testable, and reference code precisely
- Explicit error paths and constraints must be stated
- Smallest viable change; no unrelated edits
- Code references to modified/inspected files where relevant

## Governance

All implementations must strictly adhere to these principles. Any deviation must be documented and justified. The constitution governs the complete unified project (book + live RAG chatbot). Amendments require explicit documentation of changes, approval process, and migration plan for any affected components. All PRs and reviews must verify compliance with these principles. The project must remain publicly reproducible and accessible.

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06