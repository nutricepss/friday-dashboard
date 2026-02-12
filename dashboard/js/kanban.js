// Kanban Dashboard JavaScript
// NutriCepss AI Squad Dashboard

class KanbanBoard {
    constructor() {
        this.tasks = [];
        this.agents = {
            'friday': { name: 'Friday', emoji: '🤌', color: '#f59e0b' },
            'content_writinator': { name: 'Writinator', emoji: '📝', color: '#ec4899' },
            'data_detective': { name: 'Detective', emoji: '🔍', color: '#3b82f6' },
            'coach_cory': { name: 'Coach Cory', emoji: '📊', color: '#10b981' },
            'seo_steve': { name: 'SEO Steve', emoji: '📈', color: '#8b5cf6' },
            'code_ninja': { name: 'Code Ninja', emoji: '🥷', color: '#14b8a6' },
            'pr_princess': { name: 'PR Princess', emoji: '👑', color: '#f43f5e' }
        };
        this.init();
    }

    init() {
        this.loadTasks();
        this.loadChat();
        this.setupDragAndDrop();
        this.updateStats();
        this.startAutoRefresh();
    }

    // Load tasks from localStorage or API
    loadTasks() {
        // Demo tasks for now
        this.tasks = [
            {
                id: 1,
                title: 'Create Instagram reel about protein myths',
                description: 'Hook: "Stop wasting money on these 3 supplements"',
                agent: 'content_writinator',
                priority: 'high',
                status: 'todo',
                deadline: '6 PM today',
                created: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Find 5 Reddit engagement opportunities',
                description: 'Monitor r/Fitness_India and r/Indianfitness for leads',
                agent: 'data_detective',
                priority: 'urgent',
                status: 'in-progress',
                deadline: '4 PM today',
                created: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Analyze HubFit ghosting clients',
                description: '26 clients ghosting >14 days - need follow-up strategy',
                agent: 'coach_cory',
                priority: 'urgent',
                status: 'review',
                deadline: 'Done',
                created: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Update Shopify theme for Sivola',
                description: 'Fix mobile responsiveness, optimize product pages',
                agent: 'code_ninja',
                priority: 'normal',
                status: 'backlog',
                deadline: 'This week',
                created: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Create UGC ad concepts for coaching',
                description: 'Before/after transformation stories',
                agent: 'pr_princess',
                priority: 'high',
                status: 'todo',
                deadline: 'Tomorrow',
                created: new Date().toISOString()
            }
        ];
        
        this.renderBoard();
    }

    // Render all tasks to the board
    renderBoard() {
        const columns = {
            'backlog': document.getElementById('backlog-tasks'),
            'todo': document.getElementById('todo-tasks'),
            'in-progress': document.getElementById('inprogress-tasks'),
            'review': document.getElementById('review-tasks'),
            'done': document.getElementById('done-tasks')
        };

        // Clear all columns
        Object.values(columns).forEach(col => col.innerHTML = '');

        // Count tasks per column
        const counts = { 'backlog': 0, 'todo': 0, 'in-progress': 0, 'review': 0, 'done': 0 };

        // Render tasks
        this.tasks.forEach(task => {
            const card = this.createTaskCard(task);
            if (columns[task.status]) {
                columns[task.status].appendChild(card);
                counts[task.status]++;
            }
        });

        // Update counts
        Object.keys(counts).forEach(status => {
            const column = document.querySelector(`[data-status="${status}"]`);
            if (column) {
                const countEl = column.querySelector('.column-count');
                if (countEl) countEl.textContent = counts[status];
            }
        });
    }

    // Create a task card element
    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.taskId = task.id;

        const agent = this.agents[task.agent] || { name: 'Unknown', emoji: '❓', color: '#666' };
        const priorityClass = `priority-${task.priority}`;

        card.innerHTML = `
            <span class="task-priority ${priorityClass}">${task.priority}</span>
            <div class="task-title">${task.title}</div>
            <div class="task-description" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">${task.description}</div>
            <div class="task-meta">
                <div class="task-agent">
                    <div class="task-agent-avatar" style="background: ${agent.color}20; border: 1px solid ${agent.color};">${agent.emoji}</div>
                    <span>${agent.name}</span>
                </div>
                <span class="task-deadline">⏰ ${task.deadline}</span>
            </div>
        `;

        // Drag events
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', task.id);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        // Click to edit
        card.addEventListener('click', () => {
            this.editTask(task.id);
        });

        return card;
    }

    // Setup drag and drop
    setupDragAndDrop() {
        const columns = document.querySelectorAll('.column-content');
        
        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(column, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    column.appendChild(draggable);
                } else {
                    column.insertBefore(draggable, afterElement);
                }
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const newStatus = column.parentElement.dataset.status;
                this.updateTaskStatus(taskId, newStatus);
            });
        });
    }

    // Get element after which to insert dragged element
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Update task status
    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            this.renderBoard();
            this.updateStats();
            
            // Log to chat
            this.addChatMessage('friday', `Moved task "${task.title}" to ${newStatus.replace('-', ' ')}`);
        }
    }

    // Update statistics
    updateStats() {
        const active = this.tasks.filter(t => t.status !== 'done').length;
        const doneToday = this.tasks.filter(t => t.status === 'done').length;
        const urgent = this.tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;

        document.getElementById('active-tasks').textContent = active;
        document.getElementById('completed-today').textContent = doneToday;
        document.getElementById('urgent-items').textContent = urgent;
    }

    // Load chat messages
    loadChat() {
        const chatContainer = document.getElementById('chat-messages');
        
        // Demo chat messages
        const messages = [
            { agent: 'friday', text: 'Good evening team! Ready to crush some tasks? ☕', time: '21:30' },
            { agent: 'content_writinator', text: 'Always ready to make things VIRAL! 🔥', time: '21:30' },
            { agent: 'data_detective', text: 'Hmm, I\'m sensing some interesting data patterns... 🕵️', time: '21:30' },
            { agent: 'coach_cory', text: 'Just finished the HubFit analysis. We need to talk about those ghosting clients... 📊', time: '21:31' },
            { agent: 'code_ninja', text: 'Deploying dashboard updates... SHIP IT! 🚀', time: '21:32' },
            { agent: 'pr_princess', text: 'Darling, I have the PERFECT UGC concept for tomorrow! 💅✨', time: '21:33' },
            { agent: 'seo_steve', text: 'CTR on the last reel was INSANE! 📈 Numbers don\'t lie!', time: '21:34' }
        ];

        chatContainer.innerHTML = '';
        messages.forEach(msg => {
            this.addChatMessage(msg.agent, msg.text, msg.time, false);
        });

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Add chat message
    addChatMessage(agentId, text, time = null, append = true) {
        const chatContainer = document.getElementById('chat-messages');
        const agent = this.agents[agentId] || { name: 'Unknown', emoji: '❓', color: '#666' };
        
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.innerHTML = `
            <div class="chat-avatar" style="background: ${agent.color}20; border: 1px solid ${agent.color};">${agent.emoji}</div>
            <div class="chat-content">
                <div class="chat-author" style="color: ${agent.color};">${agent.name}</div>
                <div class="chat-text">${text}</div>
                <div class="chat-time">${time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;

        if (append) {
            chatContainer.appendChild(messageEl);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
            chatContainer.appendChild(messageEl);
        }
    }

    // Start auto-refresh
    startAutoRefresh() {
        // Refresh every 30 seconds
        setInterval(() => {
            this.loadTasks();
            this.updateStats();
        }, 30000);
    }

    // Edit task
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Fill modal with task data
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-agent').value = task.agent;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-deadline').value = task.deadline;

        // Show modal
        document.getElementById('task-modal').classList.add('active');
    }
}

// Global functions
function createTask() {
    document.getElementById('task-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('task-modal').classList.remove('active');
    // Clear form
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-agent').value = '';
    document.getElementById('task-priority').value = 'normal';
    document.getElementById('task-deadline').value = '';
}

function saveTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const agent = document.getElementById('task-agent').value;
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;

    if (!title || !agent) {
        alert('Please fill in task title and assign an agent!');
        return;
    }

    // Add task to board
    const newTask = {
        id: Date.now(),
        title,
        description,
        agent,
        priority,
        status: 'todo',
        deadline: deadline || 'No deadline',
        created: new Date().toISOString()
    };

    window.kanban.tasks.push(newTask);
    window.kanban.renderBoard();
    window.kanban.updateStats();

    // Log to chat
    const agentName = window.kanban.agents[agent]?.name || agent;
    window.kanban.addChatMessage('friday', `Created new task: "${title}" assigned to ${agentName}`);

    closeModal();
}

function addTaskToColumn(column) {
    createTask();
}

function viewChat() {
    const chatPanel = document.querySelector('.chat-panel');
    chatPanel.style.display = 'flex';
}

function viewReports() {
    alert('Reports view coming soon! 📊');
}

function toggleChat() {
    const chatPanel = document.querySelector('.chat-panel');
    chatPanel.style.display = chatPanel.style.display === 'none' ? 'flex' : 'none';
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (text) {
        window.kanban.addChatMessage('friday', text);
        input.value = '';
        
        // Simulate agent response
        setTimeout(() => {
            const agents = Object.keys(window.kanban.agents).filter(a => a !== 'friday');
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            
            const responses = [
                'Got it! On it! 💪',
                'Interesting... let me think about this... 🤔',
                'I can help with that! 🚀',
                'Consider it done! ✨',
                'Working on it now! 🔥'
            ];
            
            window.kanban.addChatMessage(randomAgent, responses[Math.floor(Math.random() * responses.length)]);
        }, 1000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.kanban = new KanbanBoard();
    
    // Setup filters
    document.getElementById('filter-agent').addEventListener('change', () => {
        window.kanban.renderBoard();
    });
    
    document.getElementById('filter-priority').addEventListener('change', () => {
        window.kanban.renderBoard();
    });
});

// Welcome message
console.log('🤌 NutriCepss AI Squad Dashboard loaded!');
console.log('Friday: "I\'ve got this. Go grab a coffee. ☕"');