# AI Usage

## 1. Which AI tools did you use?

- OpenAI Codex / GPT-5 coding assistant

## 2. What did you ask AI to help with?

- Backend scaffolding with Express, Sequelize, MySQL, middleware, migrations, and tests
- Frontend task UI, API integration, validation, rich-text editing, responsive polish, and test setup
- Deployment support for Railway
- Plan/status documentation updates

## 3. Which parts of the code were AI-assisted?

- Backend API structure and middleware
- Task service, controller, routes, schemas, and DB configuration
- Frontend task board, dialogs, filters, detail view, date picker, and table
- Rich-text editor integration
- Frontend test setup and initial tests
- project documentation

## 4. What did you manually change or verify?

- Fronted Backend Application strtcture
- Backend common module assistance, middelware setup
- Reviewed and adjusted generated code during implementation
- Verified environment configuration assumptions for backend and frontend
- Manually API Testing in postman.
- API Integration In Fronted
- Corrected UI issues such as calendar behavior, table layout, action controls, and search flicker
- Adjusted Railway compatibility by removing automatic database creation
- Fronted Deploy on Netlify And Backend is deploy in Railway
- Resolve CORS Issue.

## 5. How did you test the solution?

- Ran backend TypeScript build
- Ran frontend TypeScript/Vite production build
- Ran frontend Vitest test suite
- Ran backend API tests earlier in the implementation flow
- Performed manual UI and API behavior fixes based on observed issues

## 6. Did AI produce anything incorrect or risky?

- Yes, some generated UI behavior needed correction
- The first lightweight rich-text editor approach was not robust enough and was replaced with Tiptap
- Calendar positioning, selection styling, and disabled-date behavior needed follow-up fixes
- Railway deployment needed manual environment/config guidance beyond code changes

## 7. What would you improve if you had more time?

- Add broader frontend integration tests with mocked API flows
- Add more backend tests for search, summary, and soft-delete edge cases
- Share schemas/contracts between frontend and backend
- Optimize frontend bundle size after adding Tiptap
- Continue responsive and accessibility polish
