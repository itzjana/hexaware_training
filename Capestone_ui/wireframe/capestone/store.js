// store.js - Shared state and unified navigation layout manager

// Initial Seeding Data
// Initial Seeding Data
const initialVehicles = [
    { id: "v-1", category: "CAR", manufacture_year: 2023, registration_number: "MH 01 AA 1234" },
    { id: "v-2", category: "MOTORCYCLE", manufacture_year: 2022, registration_number: "KA 03 EX 9988" }
];

const initialPolicies = [
    { id: "pol-1", name: "Essential Shield", description: "Basic liability coverage for standard vehicles.", rate: 120.00, risk: "Low", addons: ["Roadside Assistance"], status: "Active" },
    { id: "pol-2", name: "Premium Fleet", description: "Multi-car discount package for high-value clients.", rate: 450.00, risk: "Medium", addons: ["Rental Reimbursement", "Glass Protection"], status: "Draft" },
    { id: "pol-3", name: "Student Starter", description: "Reduced premium for college students with good grades.", rate: 85.00, risk: "Low", addons: [], status: "Active" }
];

const initialAddons = [
    { id: "add-1", name: "Roadside Assistance", description: "24/7 towing and roadside assistance support", cost: 15.00 },
    { id: "add-2", name: "Rental Reimbursement", description: "Rental car reimbursement up to $30/day", cost: 25.00 },
    { id: "add-3", name: "Glass Protection", description: "Full cover for windshield and glass repairs", cost: 10.00 }
];

const initialProposals = [
    { id: "AG-2024-8839", vehicleId: "v-1", type: "Comprehensive Plan", name: "Elite Fleet Protection", status: "ACTIVE", startDate: "2024-12-12", endDate: "2025-12-11", premium: 1200.00, submissionDate: "2024-12-10", addons: ["Roadside Assistance"] },
    { id: "AG-2024-1102", vehicleId: "v-2", type: "Third Party Only", name: "Logistics Basic", status: "ACTIVE", startDate: "2024-03-04", endDate: "2025-03-03", premium: 350.00, submissionDate: "2024-03-01", addons: [] },
    { id: "AG-2024-8842-XP", vehicleId: "v-1", type: "Comprehensive Plan", name: "Comprehensive Auto Shield", status: "VERIFIED", startDate: "2024-10-24", endDate: "2025-10-23", premium: 1240.00, submissionDate: "2024-10-23", officerRemark: "Vehicle inspection documents are verified. VIN matches. Awaiting payment.", addons: ["Zero Depreciation", "Roadside Assistance", "Engine Protection"] },
    { id: "AG-2024-9020-B", vehicleId: "v-1", type: "Own Damage Only", name: "Sustainable Driver", status: "QUOTE_GENERATED", startDate: "2024-03-15", endDate: "2025-03-14", premium: 420.00, submissionDate: "2024-03-14", addons: ["Engine Protection"] }
];

const initialClaims = [
    {
        id: "CL-4892-X",
        policyId: "AG-2024-8839",
        description: "Minor fender bender at the parking lot causing bumper alignment issues.",
        officerNote: "Property damage photos verified. Incident report matches description. Need medical verification.",
        status: "UNDER_REVIEW",
        createdAt: "2024-10-24T18:30:00Z",
        notes: [
            { date: "2024-10-26T14:20:00Z", author: "Officer Marcus T.", text: "Property damage photos verified. Alignment with incident report confirmed. Need secondary verification for medical billing entries." },
            { date: "2024-10-25T09:15:00Z", author: "System Audit", text: "Initial eligibility check: PASSED. Policy #AG-8829-X active at time of loss." }
        ]
    }
];

// LocalStorage check and seeding
if (!localStorage.getItem("vehicles")) {
    localStorage.setItem("vehicles", JSON.stringify(initialVehicles));
}
if (!localStorage.getItem("policies")) {
    localStorage.setItem("policies", JSON.stringify(initialPolicies));
}
if (!localStorage.getItem("addons")) {
    localStorage.setItem("addons", JSON.stringify(initialAddons));
}
if (!localStorage.getItem("proposals")) {
    localStorage.setItem("proposals", JSON.stringify(initialProposals));
}
if (!localStorage.getItem("claims")) {
    localStorage.setItem("claims", JSON.stringify(initialClaims));
}

// Vehicle CRUD API
function getVehicles() {
    return JSON.parse(localStorage.getItem("vehicles"));
}

function saveVehicle(vehicle) {
    const vehicles = getVehicles();
    if (vehicle.id) {
        const index = vehicles.findIndex(v => v.id === vehicle.id);
        if (index !== -1) {
            vehicles[index] = vehicle;
        }
    } else {
        vehicle.id = "v-" + Date.now();
        vehicles.push(vehicle);
    }
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    return vehicle;
}

function deleteVehicle(id) {
    const vehicles = getVehicles();
    const updated = vehicles.filter(v => v.id !== id);
    localStorage.setItem("vehicles", JSON.stringify(updated));
}

// Proposals CRUD API
function getProposals() {
    return JSON.parse(localStorage.getItem("proposals"));
}

function saveProposal(proposal) {
    const proposals = getProposals();
    if (proposal.id) {
        const index = proposals.findIndex(p => p.id === proposal.id);
        if (index !== -1) {
            proposals[index] = proposal;
        }
    } else {
        proposal.id = "AG-2026-" + Math.floor(1000 + Math.random() * 9000);
        proposal.submissionDate = new Date().toISOString().split('T')[0];
        proposals.push(proposal);
    }
    localStorage.setItem("proposals", JSON.stringify(proposals));
    return proposal;
}

function deleteProposal(id) {
    const proposals = getProposals();
    const updated = proposals.filter(p => p.id !== id);
    localStorage.setItem("proposals", JSON.stringify(updated));
}

// Claims API
function getClaims() {
    return JSON.parse(localStorage.getItem("claims"));
}

function saveClaim(claim) {
    const claims = getClaims();
    if (claim.id) {
        const index = claims.findIndex(c => c.id === claim.id);
        if (index !== -1) {
            claims[index] = claim;
        }
    } else {
        claim.id = "CL-" + Math.floor(1000 + Math.random() * 9000) + "-X";
        claim.createdAt = new Date().toISOString();
        claim.status = "INITIATED";
        claim.notes = [
            { date: new Date().toISOString(), author: "System Audit", text: "Initial eligibility check: PASSED. Claim initiated." }
        ];
        claims.push(claim);
    }
    localStorage.setItem("claims", JSON.stringify(claims));
    return claim;
}

// Navigation rendering helper
function renderNavigation(activeTab) {
    const topnav = document.getElementById("topnav-container");
    const sidebar = document.getElementById("sidebar-container");
    const bottomnav = document.getElementById("bottomnav-container");

    if (topnav) {
        topnav.innerHTML = `
        <nav class="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface border-b border-outline-variant">
            <div class="text-headline-md font-headline-md font-black text-primary uppercase cursor-pointer" onclick="location.href='index.html'">AutoGuard</div>
            <div class="hidden md:flex gap-8 items-center h-full">
                <a class="text-secondary font-label-md text-label-md hover:text-primary transition-colors" href="index.html">Home</a>
                <a class="text-secondary font-label-md text-label-md hover:text-primary transition-colors" href="my_policies.html">Policies</a>
                <a class="text-primary font-bold border-b-2 border-primary pb-1 text-label-md font-label-md" href="customer_dashboard.html">Dashboard</a>
                <a class="text-secondary font-label-md text-label-md hover:text-primary transition-colors" href="index.html">Logout</a>
            </div>
            <div class="flex items-center gap-4">
                <button class="material-symbols-outlined text-secondary hover:text-primary transition-colors" onclick="showToast('No new notifications', 'info')">notifications</button>
                <button class="material-symbols-outlined text-secondary hover:text-primary transition-colors" onclick="location.href='customer_dashboard.html'">account_circle</button>
            </div>
        </nav>
        `;
    }

    if (sidebar) {
        const getLinkClass = (tabName) => {
            return activeTab === tabName 
                ? "flex items-center gap-3 px-4 py-3 bg-primary text-on-primary font-bold transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high transition-all duration-200";
        };

        sidebar.innerHTML = `
        <aside class="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 bg-surface-container-lowest border-r border-outline-variant">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-8">
                    <div class="w-10 h-10 rounded-full border border-outline flex items-center justify-center bg-surface-variant overflow-hidden">
                        <span class="material-symbols-outlined">person</span>
                    </div>
                    <div>
                        <div class="text-label-md font-label-md font-bold text-primary">Customer Portal</div>
                        <div class="text-body-sm font-body-sm text-secondary">John Doe</div>
                    </div>
                </div>
                <nav class="space-y-1">
                    <a class="${getLinkClass('dashboard')}" href="customer_dashboard.html">
                        <span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                        <span class="text-label-md font-label-md">Dashboard</span>
                    </a>
                    <a class="${getLinkClass('vehicles')}" href="vehicles.html">
                        <span class="material-symbols-outlined" data-icon="directions_car">directions_car</span>
                        <span class="text-label-md font-label-md">My Vehicles</span>
                    </a>
                    <a class="${getLinkClass('policies')}" href="my_policies.html">
                        <span class="material-symbols-outlined" data-icon="description">description</span>
                        <span class="text-label-md font-label-md">My Policies</span>
                    </a>
                    <a class="${getLinkClass('proposals')}" href="my_proposals.html">
                        <span class="material-symbols-outlined" data-icon="rate_review">rate_review</span>
                        <span class="text-label-md font-label-md">My Proposals</span>
                    </a>
                    <a class="${getLinkClass('apply')}" href="apply_policy.html">
                        <span class="material-symbols-outlined" data-icon="add_circle">add_circle</span>
                        <span class="text-label-md font-label-md">Apply Policy</span>
                    </a>
                    <a class="${getLinkClass('claims')}" href="claim_tracking.html">
                        <span class="material-symbols-outlined" data-icon="assignment_late">assignment_late</span>
                        <span class="text-label-md font-label-md">Claims</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high transition-all duration-200" href="#" onclick="showToast('No outstanding balances due.', 'success')">
                        <span class="material-symbols-outlined" data-icon="payments">payments</span>
                        <span class="text-label-md font-label-md">Payments</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high transition-all duration-200" href="#" onclick="showToast('Settings console under construction.', 'warning')">
                        <span class="material-symbols-outlined" data-icon="settings">settings</span>
                        <span class="text-label-md font-label-md">Settings</span>
                    </a>
                </nav>
                <div class="mt-8">
                    <button class="w-full bg-primary text-on-primary font-bold py-3 uppercase text-label-md tracking-wider border border-primary hover:bg-transparent hover:text-primary transition-colors" onclick="location.href='apply_policy.html?action=new'">
                        New Proposal
                    </button>
                </div>
            </div>
            <div class="mt-auto border-t border-outline-variant p-6 space-y-1">
                <a class="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-surface-container-high transition-all duration-200" href="#" onclick="showToast('Customer Support is available 24/7 at 1-800-AUTOGUARD', 'info')">
                    <span class="material-symbols-outlined" data-icon="help">help</span>
                    <span class="text-label-md font-label-md">Support</span>
                </a>
                <a class="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-surface-container-high transition-all duration-200" href="index.html">
                    <span class="material-symbols-outlined" data-icon="logout">logout</span>
                    <span class="text-label-md font-label-md">Logout</span>
                </a>
            </div>
        </aside>
        `;
    }

    if (bottomnav) {
        const getMobileClass = (tabName) => {
            return activeTab === tabName
                ? "flex flex-col items-center gap-1 text-primary"
                : "flex flex-col items-center gap-1 text-secondary";
        };

        bottomnav.innerHTML = `
        <button class="${getMobileClass('dashboard')}" onclick="location.href='customer_dashboard.html'">
            <span class="material-symbols-outlined">dashboard</span>
            <span class="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button class="${getMobileClass('vehicles')}" onclick="location.href='vehicles.html'">
            <span class="material-symbols-outlined">directions_car</span>
            <span class="text-[10px] uppercase">Vehicles</span>
        </button>
        <button class="${getMobileClass('policies')}" onclick="location.href='my_policies.html'">
            <span class="material-symbols-outlined">description</span>
            <span class="text-[10px] uppercase">Policies</span>
        </button>
        <button class="${getMobileClass('apply')}" onclick="location.href='apply_policy.html'">
            <span class="material-symbols-outlined">add_circle</span>
            <span class="text-[10px] uppercase">Apply</span>
        </button>
        <button class="${getMobileClass('claims')}" onclick="location.href='claim_tracking.html'">
            <span class="material-symbols-outlined">assignment_late</span>
            <span class="text-[10px] uppercase">Claims</span>
        </button>
        `;
    }
}

// Policy Templates CRUD API
function getPolicies() {
    return JSON.parse(localStorage.getItem("policies")) || [];
}

function savePolicy(policy) {
    const policies = getPolicies();
    if (policy.id) {
        const index = policies.findIndex(p => p.id === policy.id);
        if (index !== -1) {
            policies[index] = policy;
        }
    } else {
        policy.id = "pol-" + Date.now();
        policies.push(policy);
    }
    localStorage.setItem("policies", JSON.stringify(policies));
    return policy;
}

function deletePolicy(id) {
    const policies = getPolicies();
    const updated = policies.filter(p => p.id !== id);
    localStorage.setItem("policies", JSON.stringify(updated));
}

// Addon Templates CRUD API
function getAddons() {
    return JSON.parse(localStorage.getItem("addons")) || [];
}

function saveAddon(addon) {
    const addons = getAddons();
    if (addon.id) {
        const index = addons.findIndex(a => a.id === addon.id);
        if (index !== -1) {
            addons[index] = addon;
        }
    } else {
        addon.id = "add-" + Date.now();
        addons.push(addon);
    }
    localStorage.setItem("addons", JSON.stringify(addons));
    return addon;
}

function deleteAddon(id) {
    const addons = getAddons();
    const updated = addons.filter(a => a.id !== id);
    localStorage.setItem("addons", JSON.stringify(updated));
}

// Unified Officer Navigation Helper
function renderOfficerNavigation(activeTab) {
    const topnav = document.getElementById("topnav-container");
    const sidebar = document.getElementById("sidebar-container");
    const bottomnav = document.getElementById("bottomnav-container");

    if (topnav) {
        topnav.innerHTML = `
        <nav class="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface border-b border-outline-variant">
            <div class="flex items-center gap-8">
                <div class="text-headline-md font-headline-md font-black text-primary uppercase cursor-pointer" onclick="location.href='index.html'">AutoGuard</div>
                <div class="hidden md:flex gap-6">
                    <a class="text-secondary hover:text-primary transition-colors text-label-md font-label-md" href="index.html">Home</a>
                    <a class="text-secondary hover:text-primary transition-colors text-label-md font-label-md" href="my_policies.html">Policies</a>
                    <a class="text-primary font-bold border-b-2 border-primary pb-1 text-label-md font-label-md" href="officer_dashboard.html">Dashboard</a>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <button class="material-symbols-outlined text-secondary hover:text-primary transition-colors" onclick="showToast('No new notifications', 'info')">notifications</button>
                <button class="material-symbols-outlined text-secondary hover:text-primary transition-colors" onclick="location.href='officer_dashboard.html'">account_circle</button>
            </div>
        </nav>
        `;
    }

    if (sidebar) {
        const getLinkClass = (tabName) => {
            return activeTab === tabName 
                ? "flex items-center gap-3 px-6 py-3 bg-primary text-on-primary font-bold transition-all duration-200"
                : "flex items-center gap-3 px-6 py-3 text-secondary hover:bg-surface-container-high transition-all duration-200";
        };

        sidebar.innerHTML = `
        <aside class="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 bg-surface-container-lowest border-r border-outline-variant">
            <div class="p-6">
                <div class="px-2 mb-8">
                    <h2 class="text-headline-sm font-headline-sm font-black text-primary">Officer Portal</h2>
                    <p class="text-body-sm font-body-sm text-secondary">Claims & Underwriting</p>
                </div>
                <nav class="space-y-1">
                    <a class="${getLinkClass('dashboard')}" href="officer_dashboard.html">
                        <span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                        <span class="text-label-md font-label-md">Dashboard</span>
                    </a>
                    <a class="${getLinkClass('policies')}" href="policy_management.html">
                        <span class="material-symbols-outlined" data-icon="description">description</span>
                        <span class="text-label-md font-label-md">Policy & Addon CRUD</span>
                    </a>
                    <a class="${getLinkClass('proposals')}" href="proposal_review.html">
                        <span class="material-symbols-outlined" data-icon="rate_review">rate_review</span>
                        <span class="text-label-md font-label-md">Proposals Queue</span>
                    </a>
                    <a class="${getLinkClass('claims')}" href="claim_review.html">
                        <span class="material-symbols-outlined" data-icon="assignment_late">assignment_late</span>
                        <span class="text-label-md font-label-md">Claims Queue</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high transition-all duration-200" href="#" onclick="showToast('Officer payout ledger is fully integrated.', 'success')">
                        <span class="material-symbols-outlined" data-icon="payments">payments</span>
                        <span class="text-label-md font-label-md">Payments</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high transition-all duration-200" href="#" onclick="showToast('Officer Settings is under construction.', 'warning')">
                        <span class="material-symbols-outlined" data-icon="settings">settings</span>
                        <span class="text-label-md font-label-md">Settings</span>
                    </a>
                </nav>
                <div class="mt-8">
                    <button class="w-full bg-primary text-on-primary font-bold py-3 uppercase text-label-md tracking-wider border border-primary hover:bg-transparent hover:text-primary transition-colors" onclick="location.href='policy_management.html'">
                        Configure Policies
                    </button>
                </div>
            </div>
            <div class="mt-auto border-t border-outline-variant p-6 space-y-1">
                <a class="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-surface-container-high transition-all duration-200" href="#" onclick="showToast('Officer technical support hotline: 1-888-GUARD-TECH', 'info')">
                    <span class="material-symbols-outlined" data-icon="help">help</span>
                    <span class="text-label-md font-label-md">Support</span>
                </a>
                <a class="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-surface-container-high transition-all duration-200" href="index.html">
                    <span class="material-symbols-outlined" data-icon="logout">logout</span>
                    <span class="text-label-md font-label-md">Logout</span>
                </a>
            </div>
        </aside>
        `;
    }

    if (bottomnav) {
        const getMobileClass = (tabName) => {
            return activeTab === tabName
                ? "flex flex-col items-center gap-1 text-primary font-bold"
                : "flex flex-col items-center gap-1 text-secondary";
        };

        bottomnav.innerHTML = `
        <button class="${getMobileClass('dashboard')}" onclick="location.href='officer_dashboard.html'">
            <span class="material-symbols-outlined">dashboard</span>
            <span class="text-[10px] uppercase">Dash</span>
        </button>
        <button class="${getMobileClass('policies')}" onclick="location.href='policy_management.html'">
            <span class="material-symbols-outlined">description</span>
            <span class="text-[10px] uppercase">Policies</span>
        </button>
        <button class="${getMobileClass('proposals')}" onclick="location.href='proposal_review.html'">
            <span class="material-symbols-outlined">rate_review</span>
            <span class="text-[10px] uppercase">Props</span>
        </button>
        <button class="${getMobileClass('claims')}" onclick="location.href='claim_review.html'">
            <span class="material-symbols-outlined">assignment_late</span>
            <span class="text-[10px] uppercase">Claims</span>
        </button>
        `;
    }
}
