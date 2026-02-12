# Friday Task Manager - Kanban Board

An interactive Kanban board for task management and agent tracking, built with Next.js and Tailwind CSS.

## Features

### 1. Kanban Board
- **Columns**: To Do, In Progress, Review, Done
- **Drag-and-drop**: Move tasks between columns
- **Click to expand**: View task details

### 2. Task Cards Display
- Task name and description
- Assigned agent (coder, researcher, content_writer, marketing, ops, coordinator)
- Model being used (deepseek-coder, kimi, etc.)
- Frequency/schedule (one-time, hourly, daily, weekly, complete)
- Status indicator and priority level
- Created and updated dates

### 3. Add New Task Form
- Task name and description
- Assign to agent (dropdown)
- Set frequency (one-time, hourly, daily, weekly)
- Priority level (low, medium, high)

### 4. To-Do List View
- Simple list format alternative to kanban
- Check off completed items
- Delete tasks directly

### 5. Agent Overview Panel
- List all agents with their current models
- Show active task count per agent
- Visual status indicators
- Capacity utilization bars

### 6. Pre-loaded Tasks
| Task | Agent | Model | Frequency |
|------|-------|-------|-----------|
| HubFit Dashboard | CODER | deepseek-coder | 4 AM & 4 PM |
| Social Engagement | RESEARCHER | kimi | Every 2 hrs |
| Instagram Content | CONTENT_WRITER | deepseek | Daily 9 AM |
| Email/Ops | OPS | haiku | Daily 8 AM |
| Website (done) | CODER | deepseek-coder | Complete |

## Tech Stack
- **Next.js** 14 - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **next-themes** - Dark/light mode support
- **Lucide React** - Icon library
- **Local Storage** - Data persistence

## Getting Started

### Installation
```bash
cd workspace/kanban-board
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## Usage Instructions

### Basic Operations
1. **Drag & Drop**: Click and drag tasks between columns
2. **Expand Cards**: Click the chevron icon to see full task details
3. **Add Tasks**: Use the "Add Task" button in the top right
4. **Delete Tasks**: Click the trash icon on expanded task cards
5. **Toggle View**: Switch between Kanban and List views using the icons

### Task Management
- **Status Updates**: Drag tasks to change their status
- **Priority**: Tasks show priority badges (High/Medium/Low)
- **Frequency**: Shows task recurrence schedule
- **Agent Assignment**: Each task is assigned to a specific agent

### Agent Tracking
- **Overview Panel**: Shows all agents and their current load
- **Status Indicators**: Green = Available, Yellow = Active, Red = Overloaded
- **Model Info**: Shows which AI model each agent is using

### Data Persistence
- All tasks are automatically saved to browser localStorage
- Data persists between browser sessions
- No server/database required

## Project Structure
```
workspace/kanban-board/
├── app/
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/
│   ├── header.tsx      # Header with theme toggle
│   ├── kanban-board.tsx # Main board with drag & drop
│   ├── kanban-column.tsx # Individual column component
│   ├── task-card.tsx   # Task card component
│   ├── agent-overview.tsx # Agent overview panel
│   └── theme-provider.tsx # Theme context provider
├── lib/
│   └── types.ts        # TypeScript types and initial data
└── public/             # Static assets
```

## Features in Detail

### Dark/Light Mode
- Toggle using the sun/moon icon in the header
- System preference detection
- Smooth transitions

### Responsive Design
- Mobile-friendly layout
- Adapts to different screen sizes
- Touch-friendly drag & drop

### Performance
- Client-side only (no API calls)
- Efficient state management
- Optimized re-renders

## Customization

### Adding New Agents
Edit `lib/types.ts` to add new agents to the `AGENTS` array.

### Modifying Task Statuses
Update the `COLUMNS` array in `components/kanban-board.tsx`.

### Changing Colors
Modify the color utilities in `tailwind.config.ts` and `app/globals.css`.

## License
MIT