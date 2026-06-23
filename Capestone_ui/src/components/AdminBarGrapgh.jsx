import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';

export default function AdminBarGraph() {
    const [chartData,    setChartData]    = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [peak,         setPeak]         = useState(0);

    // Same pattern as AdminDashboard.jsx
    const barApi = 'http://localhost:8080/api/stat/officers/top';

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchBarData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(barApi, config);
            buildChart(response.data);
        } catch (err) {
            setError('Failed to load chart data');
        } finally {
            setLoading(false);
        }
    };

    const buildChart = (raw) => {
        const entries = Array.isArray(raw) ? raw : [];
        const labels  = entries.map(e => e.name ?? 'Officer');
        const proposals = entries.map(e => e.proposalCount ?? 0);
        const claims  = entries.map(e => e.claimCount ?? 0);
        const totals  = entries.map(e => e.totalHandled ?? 0);
        const maxVal  = Math.max(...totals, 0);
        setPeak(maxVal);

        setChartData({
            labels,
            datasets: [
                {
                    label:                'Proposals Handled',
                    data:                 proposals,
                    backgroundColor:      'rgba(99, 102, 241, 0.75)',
                    borderColor:          '#6366f1',
                    borderWidth:          2,
                    borderRadius:         6,
                    borderSkipped:        false,
                    hoverBackgroundColor: 'rgba(99, 102, 241, 0.95)',
                },
                {
                    label:                'Claims Handled',
                    data:                 claims,
                    backgroundColor:      'rgba(239, 68, 68, 0.75)',
                    borderColor:          '#ef4444',
                    borderWidth:          2,
                    borderRadius:         6,
                    borderSkipped:        false,
                    hoverBackgroundColor: 'rgba(239, 68, 68, 0.95)',
                }
            ],
        });

        setChartOptions({
            responsive:          true,
            maintainAspectRatio: false,
            animation:           { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#475569',
                        font: { size: 11, family: "'Inter', sans-serif", weight: 'bold' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.y}`,
                    },
                    backgroundColor: '#1e293b',
                    titleColor:      '#f8fafc',
                    bodyColor:       '#cbd5e1',
                    padding:         12,
                    cornerRadius:    8,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    grid:   { display: false },
                    ticks:  { color: '#64748b', font: { size: 12, family: "'Inter', sans-serif" } },
                    border: { display: false },
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid:        { color: '#f1f5f9', borderDash: [4, 4] },
                    ticks:       { color: '#94a3b8', font: { size: 11, family: "'Inter', sans-serif" }, precision: 0 },
                    border:      { display: false },
                },
            },
        });
    };

    useEffect(() => {
        fetchBarData();
    }, []);

    return (
        <div className="bg-white border rounded-3 shadow-sm p-4 h-100">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h6 className="text-uppercase fw-bold mb-1"
                        style={{ fontSize: '0.75rem', letterSpacing: '0.07em', color: '#64748b' }}>
                        Officer Workload
                    </h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>
                        Top 5 officers by total handled cases (proposals + claims)
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    {peak > 0 && (
                        <span className="badge rounded-pill px-3 py-2"
                              style={{ background: '#ede9fe', color: '#6366f1', fontSize: '0.72rem', fontWeight: 700 }}>
                            Max Handled: {peak}
                        </span>
                    )}
                    <span className="badge rounded-pill px-3 py-2"
                          style={{ background: '#f1f5f9', color: '#6366f1', fontSize: '0.72rem', fontWeight: 700 }}>
                        <i className="bi bi-bar-chart-fill me-1" />Stacked
                    </span>
                </div>
            </div>

            {/* Chart body */}
            <div style={{ position: 'relative', height: '275px' }}>
                {loading && (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted gap-2">
                        <div className="spinner-border spinner-border-sm text-primary" />
                        <span style={{ fontSize: '0.85rem' }}>Loading…</span>
                    </div>
                )}
                {error && !loading && (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                        <i className="bi bi-exclamation-circle fs-3 text-danger mb-2" />
                        <span style={{ fontSize: '0.85rem' }}>{error}</span>
                    </div>
                )}
                {!loading && !error && (
                    <Chart type="bar" data={chartData} options={chartOptions}
                           style={{ height: '275px' }} />
                )}
            </div>
        </div>
    );
}