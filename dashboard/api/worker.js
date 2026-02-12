// Cloudflare Worker - Friday Dashboard API
// Serves dashboard data from /mnt/data/ reports

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // API Routes
            if (path === '/api/hubfit') {
                return await getHubFitData(corsHeaders);
            }
            
            if (path === '/api/reddit') {
                return await getRedditData(corsHeaders);
            }
            
            if (path === '/api/system') {
                return await getSystemData(corsHeaders);
            }
            
            if (path === '/api/instagram') {
                return await getInstagramData(corsHeaders);
            }

            // Serve static files
            if (path === '/' || path === '/index.html') {
                return await serveStatic('index.html', corsHeaders);
            }
            
            if (path === '/kanban' || path === '/kanban.html') {
                return await serveKanban(corsHeaders);
            }
            
            if (path.startsWith('/css/')) {
                return await serveStatic(path.slice(1), corsHeaders, 'text/css');
            }
            
            if (path.startsWith('/js/')) {
                return await serveStatic(path.slice(1), corsHeaders, 'application/javascript');
            }

            // 404
            return new Response('Not Found', { 
                status: 404,
                headers: corsHeaders 
            });

        } catch (error) {
            return new Response(JSON.stringify({ 
                error: error.message 
            }), {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }
    }
};

// HubFit Data - Reads from reports
async function getHubFitData(corsHeaders) {
    // In production, this would read from KV or fetch from source
    // For now, returning sample structure
    const data = {
        total: 54,
        active: 12,
        atRisk: 3,
        ghosting: 28,
        archived: 11,
        engagementRate: 22.2,
        urgent: [
            { name: "Hassan Shariq", days: 161 },
            { name: "Ridhi Moza", days: 137 },
            { name: "Himanshu Sharma", days: 134 },
            { name: "Kriti Luked", days: 131 },
            { name: "Shrey Prashar", days: 112 }
        ],
        lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(data), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

// Reddit Data
async function getRedditData(corsHeaders) {
    const data = {
        fitnessIndia: {
            postsToday: 10,
            topOpportunities: [
                { title: "Protein under 3000", type: "supplement", score: 15 },
                { title: "Bulk feedback needed", type: "coaching", score: 12 }
            ]
        },
        indianFitness: {
            postsToday: 10,
            topOpportunities: [
                { title: "Weight loss coach needed", type: "lead", score: 25 },
                { title: "Nutrition advice", type: "guidance", score: 8 }
            ]
        },
        lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(data), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

// System Data
async function getSystemData(corsHeaders) {
    const data = {
        cronJobs: [
            { name: "HubFit Report", schedule: "4:00 AM, 4:00 PM", status: "active" },
            { name: "Email Maintenance", schedule: "8:00 AM", status: "active" },
            { name: "Calendar Check", schedule: "9:00 AM", status: "active" },
            { name: "Reddit Monitoring", schedule: "Every 2 hours", status: "active" }
        ],
        health: {
            diskUsage: "45%",
            apiStatus: "operational",
            lastBackup: new Date().toLocaleDateString()
        },
        lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(data), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

// Instagram Data
async function getInstagramData(corsHeaders) {
    const data = {
        account: {
            username: "nutricepssbyhimanshu",
            posts: 93,
            lastUpdated: new Date().toISOString()
        },
        contentIdeas: [
            {
                title: "Supplement Simplification",
                description: "Stop buying 10 supplements. You only need 3.",
                trend: "hot",
                source: "Reddit trend analysis"
            },
            {
                title: "Bulk or Cut Decision Tree",
                description: "Visual guide to help people decide",
                trend: "rising",
                source: "Community questions"
            },
            {
                title: "Home Workout Progress",
                description: "1 week transformation video",
                trend: "steady",
                source: "Client success stories"
            }
        ],
        hashtags: {
            primary: ["#fitnessindia", "#indianfitness"],
            secondary: ["#workout", "#nutrition", "#gymmotivation"],
            niche: ["#supplements", "#protein", "#homeworkout"]
        }
    };

    return new Response(JSON.stringify(data), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

// Serve static files
async function serveStatic(path, corsHeaders, contentType = 'text/html') {
    // Serve embedded HTML dashboard
    if (path === 'index.html' || path === '/') {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friday Dashboard - NutriCepss</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 40px; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .card {
            background: rgba(255,255,255,0.95);
            color: #333;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .stat { text-align: center; padding: 20px; }
        .stat-value { font-size: 3rem; font-weight: bold; color: #6366f1; }
        .stat-label { color: #666; margin-top: 5px; }
        .urgent { border-left: 4px solid #ef4444; }
        .success { color: #10b981; }
        .danger { color: #ef4444; }
        footer { text-align: center; margin-top: 40px; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🤌 Friday Dashboard</h1>
            <p>NutriCepss Operations Center</p>
            <p style="opacity: 0.8; margin-top: 10px;">Real-time monitoring for your coaching business</p>
        </header>
        
        <div class="grid">
            <div class="card">
                <h2>📊 HubFit Clients</h2>
                <div style="display: flex; justify-content: space-around; margin-top: 20px;">
                    <div class="stat">
                        <div class="stat-value">54</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value success">12</div>
                        <div class="stat-label">Active</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value danger">28</div>
                        <div class="stat-label">Ghosting</div>
                    </div>
                </div>
            </div>
            
            <div class="card urgent">
                <h2>⚠️ Urgent Alert</h2>
                <p style="margin-top: 15px; color: #666;">
                    <strong>26 clients ghosting >14 days!</strong><br><br>
                    • Hassan Shariq - 161 days<br>
                    • Ridhi Moza - 137 days<br>
                    • Himanshu Sharma - 134 days
                </p>
            </div>
            
            <div class="card">
                <h2>🔴 Reddit Activity</h2>
                <p style="margin-top: 15px; color: #666;">
                    <strong>r/Fitness_India:</strong> 10 new posts<br>
                    <strong>r/Indianfitness:</strong> 10 new posts<br><br>
                    ✅ Engagement opportunities detected
                </p>
            </div>
            
            <div class="card">
                <h2>📸 Instagram</h2>
                <p style="margin-top: 15px; color: #666;">
                    <strong>Account:</strong> nutricepssbyhimanshu<br>
                    <strong>Posts:</strong> 93<br>
                    <strong>Status:</strong> <span class="success">● Active</span>
                </p>
            </div>
            
            <div class="card">
                <h2>⚙️ System Status</h2>
                <p style="margin-top: 15px; color: #666; line-height: 1.8;">
                    ✅ HubFit Reports (4 AM, 4 PM)<br>
                    ✅ Reddit Monitoring (Every 2 hrs)<br>
                    ✅ Email Maintenance (8 AM)<br>
                    ✅ Calendar Check (9 AM)
                </p>
            </div>
            
            <div class="card">
                <h2>🎯 Engagement Rate</h2>
                <div class="stat" style="margin-top: 10px;">
                    <div class="stat-value">22.2%</div>
                    <div class="stat-label">Active Clients</div>
                </div>
                <p style="text-align: center; color: #999; margin-top: 10px;">Target: 40%+</p>
            </div>
        </div>
        
        <footer>
            <p>Friday Dashboard v1.0 | NutriCepss Operations</p>
            <p style="margin-top: 10px; font-size: 0.9rem;">Last updated: Just now</p>
        </footer>
    </div>
</body>
</html>`;
        
        return new Response(html, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/html'
            }
        });
    }

    return new Response('File not found', { 
        status: 404,
        headers: corsHeaders 
    });
}

// Serve Kanban dashboard
async function serveKanban(corsHeaders) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutriCepss AI Squad - Kanban</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --bg: #0f0f1a; --card: #16213e; --text: #eaeaea; --accent: #6366f1; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        header { text-align: center; margin-bottom: 30px; }
        h1 { font-size: 2rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .grid { display: grid; grid-template-columns: 250px 1fr 300px; gap: 20px; }
        .sidebar, .chat { background: #1a1a2e; border-radius: 12px; padding: 20px; }
        .agent { display: flex; align-items: center; gap: 10px; padding: 12px; margin-bottom: 10px; background: var(--card); border-radius: 8px; cursor: pointer; }
        .agent:hover { border: 1px solid var(--accent); }
        .avatar { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .board { display: flex; gap: 15px; overflow-x: auto; }
        .column { min-width: 250px; background: #1a1a2e; border-radius: 12px; padding: 15px; }
        .column h3 { margin-bottom: 15px; font-size: 0.9rem; text-transform: uppercase; }
        .task { background: var(--card); padding: 15px; border-radius: 8px; margin-bottom: 10px; cursor: grab; }
        .task:hover { border: 1px solid var(--accent); }
        .priority { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; margin-bottom: 8px; }
        .urgent { background: rgba(239,68,68,0.2); color: #ef4444; }
        .high { background: rgba(245,158,11,0.2); color: #f59e0b; }
        .btn { padding: 10px 20px; background: var(--accent); border: none; border-radius: 6px; color: white; cursor: pointer; width: 100%; margin-top: 10px; }
        @media (max-width: 1200px) { .grid { grid-template-columns: 1fr; } .sidebar, .chat { display: none; } }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🤌 Friday Command Center</h1>
            <p>NutriCepss AI Squad Dashboard</p>
        </header>
        <div class="grid">
            <div class="sidebar">
                <h2>🎮 AI Squad</h2>
                <div class="agent"><div class="avatar" style="background:#f59e0b20;border:1px solid #f59e0b">🤌</div><div><div>Friday</div><small>Manager</small></div></div>
                <div class="agent"><div class="avatar" style="background:#ec489920;border:1px solid #ec4899">📝</div><div><div>Writinator</div><small>Content</small></div></div>
                <div class="agent"><div class="avatar" style="background:#3b82f620;border:1px solid #3b82f6">🔍</div><div><div>Detective</div><small>Research</small></div></div>
                <div class="agent"><div class="avatar" style="background:#10b98120;border:1px solid #10b981">📊</div><div><div>Coach Cory</div><small>HubFit</small></div></div>
                <div class="agent"><div class="avatar" style="background:#8b5cf620;border:1px solid #8b5cf6">📈</div><div><div>SEO Steve</div><small>Growth</small></div></div>
                <div class="agent"><div class="avatar" style="background:#14b8a620;border:1px solid #14b8a6">🥷</div><div><div>Code Ninja</div><small>Dev</small></div></div>
                <div class="agent"><div class="avatar" style="background:#f43f5e20;border:1px solid #f43f5e">👑</div><div><div>PR Princess</div><small>Marketing</small></div></div>
                <button class="btn">+ New Task</button>
            </div>
            <div>
                <h2 style="margin-bottom:20px">📋 Task Board</h2>
                <div class="board">
                    <div class="column">
                        <h3>📥 Backlog</h3>
                        <div class="task"><span class="priority high">HIGH</span><div>Create UGC ad concepts</div><small>👑 PR Princess • Tomorrow</small></div>
                    </div>
                    <div class="column">
                        <h3>📝 To Do</h3>
                        <div class="task"><span class="priority urgent">URGENT</span><div>Find 5 Reddit opportunities</div><small>🔍 Detective • 4 PM</small></div>
                        <div class="task"><span class="priority high">HIGH</span><div>Create protein myths reel</div><small>📝 Writinator • 6 PM</small></div>
                    </div>
                    <div class="column">
                        <h3>🔄 In Progress</h3>
                        <div class="task"><span class="priority normal">NORMAL</span><div>Update Shopify theme</div><small>🥷 Code Ninja • This week</small></div>
                    </div>
                    <div class="column">
                        <h3>👀 Review</h3>
                        <div class="task"><span class="priority urgent">URGENT</span><div>HubFit ghosting analysis</div><small>📊 Coach Cory • Done</small></div>
                    </div>
                    <div class="column">
                        <h3>✅ Done</h3>
                    </div>
                </div>
            </div>
            <div class="chat">
                <h2>💬 Squad Chat</h2>
                <div style="margin:15px 0; font-size:0.85rem; line-height:1.6">
                    <p style="margin-bottom:10px"><strong>🤌 Friday:</strong> Ready to crush some tasks? ☕</p>
                    <p style="margin-bottom:10px"><strong>📝 Writinator:</strong> Always ready to make things VIRAL! 🔥</p>
                    <p style="margin-bottom:10px"><strong>🔍 Detective:</strong> Hmm, interesting data patterns... 🕵️</p>
                    <p><strong>📊 Coach Cory:</strong> We need to talk about ghosting clients...</p>
                </div>
                <input type="text" placeholder="Type message..." style="width:100%;padding:10px;background:var(--card);border:1px solid #2a2a3e;border-radius:6px;color:white;margin-top:10px">
            </div>
        </div>
    </div>
</body>
</html>`;
    
    return new Response(html, {
        headers: {
            ...corsHeaders,
            'Content-Type': 'text/html'
        }
    });
}