import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';

// [{"status":"ACTIVE","count":1},{"status":"PROPOSAL_SUBMITTED","count":1}]

export default function AdminPieChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const STATUS_META = {
        'PROPOSAL_SUBMITTED': { label: 'Submitted', color: '#6366f1' },
        'UNDER_REVIEW': { label: 'Under Review', color: '#f59e0b' },
        'ADDITIONAL_DETAILS_REQUIRED': { label: 'Info Required', color: '#fb923c' },
        'VERIFIED': { label: 'Verified', color: '#38bdf8' },
        'QUOTE_GENERATED': { label: 'Quote Sent', color: '#a78bfa' },
        'ACTIVE': { label: 'Active', color: '#22c55e' },
        'REJECTED': { label: 'Rejected', color: '#ef4444' },
        'EXPIRED': { label: 'Expired', color: '#94a3b8' },
        'CANCELLED': { label: 'Cancelled', color: '#64748b' },
    };

    const FALLBACK_COLORS = [
        '#6366f1', '#f59e0b', '#22c55e', '#ef4444',
        '#38bdf8', '#a78bfa', '#fb923c', '#94a3b8', '#64748b',
    ];

    const pieApi = 'http://localhost:8080/api/stat/proposals/by-status';

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchPieData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(pieApi, config);
            buildChart(response.data);
            console.log(response.data);
        } catch (err) {
            setError('Failed to load chart data');
        } finally {
            setLoading(false);
        }
    };


    const buildChart = (raw) => {
    const entries = raw.filter(item => item.count > 0);

    if (!entries.length) {
        setChartData({});
        setTotal(0);
        return;
    }

    const labels = entries.map(
        item => STATUS_META[item.status]?.label ?? item.status.replace(/_/g, ' ')
    );

    const values = entries.map(item => item.count);

    const colors = entries.map(
        (item, i) =>
            STATUS_META[item.status]?.color ??
            FALLBACK_COLORS[i % FALLBACK_COLORS.length]
    );

    const totalCount = values.reduce((a, b) => a + b, 0);

    setTotal(totalCount);

    setChartData({
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                hoverBackgroundColor: colors.map(c => c + 'cc'),
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverBorderWidth: 4,
            },
        ],
    });

    setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        animation: {
            duration: 900,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 18,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                    color: '#475569',
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const pct = (
                            (ctx.parsed / totalCount) *
                            100
                        ).toFixed(1);

                        return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                    },
                },
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                padding: 12,
                cornerRadius: 8,
            },
        },
    });
};

    useEffect(() => {
        fetchPieData();
    }, []);

    return (
        <div className="bg-white border rounded-3 shadow-sm p-4 h-100">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h6 className="text-uppercase fw-bold mb-1"
                        style={{ fontSize: '0.75rem', letterSpacing: '0.07em', color: '#64748b' }}>
                        Proposal Pipeline
                    </h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>
                        Distribution by status
                    </p>
                </div>
                <span className="badge rounded-pill px-3 py-2"
                    style={{ background: '#f1f5f9', color: '#6366f1', fontSize: '0.72rem', fontWeight: 700 }}>
                    <i className="bi bi-pie-chart-fill me-1" />Doughnut
                </span>
            </div>

            {/* Total callout */}
            {!loading && !error && total > 0 && (
                <div className="text-center mb-2">
                    <span className="fw-black" style={{ fontSize: '2rem', color: '#1e293b' }}>{total}</span>
                    <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>Total Proposals</span>
                </div>
            )}

            {/* Chart body */}
            <div style={{ position: 'relative', height: '260px' }}>
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
                    <Chart type="doughnut" data={chartData} options={chartOptions}
                        style={{ height: '260px' }} />
                )}
            </div>
        </div>
    );
}