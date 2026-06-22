# Frontend Application Plan

## Goal

Build a task tracker frontend for the Mini Task Tracker application with:

- task creation
- task listing
- task detail view
- task completion
- filtering
- search
- edit flow
- delete confirmation
- priority and due date support
- summary cards
- client-side validation
- backend API integration

## Stack Used

- React
- TypeScript
- Vite
- React Router
- Axios
- Zod
- React Day Picker
- Tiptap
- Vitest
- Testing Library

## Frontend Areas Covered

### Routing and Navigation

- application routing with task list and task detail routes
- shared shell layout
- create task entry point from the main page

### Task Board UI

- summary cards for:
  - total tasks
  - open tasks
  - completed tasks
- searchable and filterable task listing
- icon-based row actions
- responsive task detail panel

### Task Form

- create and edit in modal flow
- fields:
  - title
  - description
  - priority
  - due date
- client-side `zod` validation
- rich-text description editor using Tiptap
- inline error messages

### Task Actions

- create task
- edit task
- complete task
- soft-delete flow through confirmation modal
- open task detail by route

### API Integration

- centralized Axios instance
- task service methods for:
  - list
  - summary
  - get by id
  - create
  - update
  - complete
  - delete
- toast feedback for success and error states

### UI/UX Coverage

- loading skeletons
- empty states
- error banner handling
- responsive table/card behavior
- hidden scrollbars with preserved scrolling
- calendar popover fixes
- disabled past-date selection

### Testing Coverage

- Vitest + Testing Library setup
- utility tests for rich-text sanitizing and truncation
- component tests for:
  - task table behavior
  - task form validation

## Current Status

The planned frontend scope is implemented for the main product requirements.

Completed:

- create task
- view task list
- complete task
- filter tasks
- search tasks
- edit task
- delete task with confirmation
- priority and due date handling
- summary view
- client-side validation
- backend API integration

## Remaining Improvements

- add more end-to-end style frontend tests with mocked APIs
- improve bundle size after adding Tiptap
- continue responsive polish for edge-case screen sizes
- optionally share contracts/schemas with backend
