// Dashboard Data Manager
class DashboardData {
    constructor() {
        this.data = {
            hubfit: {},
            reddit: {},
            system: {},
            instagram: {}
        };
    }

    // Fetch HubFit data from reports
    async fetchHubFit() {
        try {
            // In production, this will be fetched from API
            // For now, using sample data structure
            return {
                total: 54,
                active: 12,
                atRisk: 3,
                ghosting: 28,
                archived: 11,
                urgent: [
                    { name: "Hassan Shariq", days: 161 },
                    { name: "Ridhi Moza", days: 137 },
                    { name: "Himanshu Sharma", days: 134 }
                ],
                engagementRate: 22.2
            };
        } catch (error) {
            console.error('HubFit fetch error:', error);
            return null;
        }
    }

    // Fetch Reddit data
    async fetchReddit() {
        try {
            return {
                fitnessIndia: 10,
                indianFitness: 10,
                opportunities: [
                    {
                        title: "Looking for weight loss coach",
                        type: "coaching_lead",
                        subreddit: "Indianfitness",
                        priority: "high"
                    },
                    {
                        title: "Supplement recommendations under 3000",
                        type: "supplement_question",
                        subreddit: "Fitness_India",
                        priority: "medium"
                    }
                ]
            };
        } catch (error) {
            console.error('Reddit fetch error:', error);
            return null;
        }
    }

    // Fetch system status
    async fetchSystem() {
        try {
            return {
                diskUsage: "45%",
                lastBackup: new Date().toLocaleDateString(),
                apiStatus: "All Good"
            };
        } catch (error) {
            console.error('System fetch error:', error);
            return null;
        }
    }

    // Fetch Instagram insights
    async fetchInstagram() {
        try {
            return {
                username: "nutricepssbyhimanshu",
                posts: 93,
                contentIdeas: [
                    {
                        title: "Supplement Simplification",
                        description: "Create reel: Stop buying 10 supplements. You only need 3.",
                        trend: "hot"
                    },
                    {
                        title: "Bulk or Cut Guide",
                        description: "Address common confusion with visual examples",
                        trend: "rising"
                    }
                ],
                hashtags: {
                    primary: ["#fitnessindia", "#indianfitness"],
                    secondary: ["#workout", "#nutrition"],
                    niche: ["#supplements", "#protein"]
                }
            };
        } catch (error) {
            console.error('Instagram fetch error:', error);
            return null;
        }
    }
}

// UI Controller
class DashboardUI {
    constructor(dataManager) {
        this.data = dataManager;
        this.charts = {};
    }

    init() {
        this.setupTabs();
        this.loadAllData();
        this.updateTimestamp();
        
        // Auto-refresh every 5 minutes
        setInterval(() => this.loadAllData(), 300000);
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remove active from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active to clicked
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    async loadAllData() {
        await this.loadHubFit();
        await this.loadReddit();
        await this.loadSystem();
        await this.loadInstagram();
        this.updateTimestamp();
    }

    async loadHubFit() {
        const data = await this.data.fetchHubFit();
        if (!data) return;

        // Update stats
        document.getElementById('hubfit-active').textContent = data.active;
        document.getElementById('hubfit-atrisk').textContent = data.atRisk;
        document.getElementById('hubfit-ghosting').textContent = data.ghosting;
        document.getElementById('hubfit-archived').textContent = data.archived;
        document.getElementById('hubfit-engagement').textContent = data.engagementRate;

        // Create chart
        this.createHubFitChart(data);

        // Update urgent list
        const urgentHtml = data.urgent.map(client => `
            <div class="urgent-item">
                <strong>${client.name}</strong>
                <span class="days">${client.days} days inactive</span>
            </div>
        `).join('');
        document.getElementById('hubfit-urgent').innerHTML = urgentHtml || '<p>No urgent alerts</p>';
    }

    createHubFitChart(data) {
        const ctx = document.getElementById('hubfit-chart');
        if (!ctx) return;

        if (this.charts.hubfit) {
            this.charts.hubfit.destroy();
        }

        this.charts.hubfit = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'At Risk', 'Ghosting', 'Archived'],
                datasets: [{
                    data: [data.active, data.atRisk, data.ghosting, data.archived],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#6b7280'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    async loadReddit() {
        const data = await this.data.fetchReddit();
        if (!data) return;

        document.getElementById('reddit-fitness').textContent = data.fitnessIndia;
        document.getElementById('reddit-indian').textContent = data.indianFitness;

        // Update opportunities
        const oppHtml = data.opportunities.map(opp => `
            <div class="opportunity-item ${opp.priority}">
                <h4>${opp.title}</h4>
                <p>r/${opp.subreddit} • ${opp.type.replace('_', ' ').toUpperCase()}</p>
            </div>
        `).join('');
        document.getElementById('reddit-opportunities').innerHTML = oppHtml;
    }

    async loadSystem() {
        const data = await this.data.fetchSystem();
        if (!data) return;

        document.getElementById('disk-usage').textContent = data.diskUsage;
    }

    async loadInstagram() {
        const data = await this.data.fetchInstagram();
        if (!data) return;

        document.getElementById('ig-posts').textContent = data.posts;
        document.getElementById('ig-username').textContent = data.username;
    }

    updateTimestamp() {
        const now = new Date();
        document.getElementById('last-updated').textContent = now.toLocaleString();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dataManager = new DashboardData();
    const ui = new DashboardUI(dataManager);
    ui.init();
});

// Export for Cloudflare Worker
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardData, DashboardUI };
}