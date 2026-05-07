import { useState, useRef, useCallback } from 'react';
import './SalesManagerTable.css';

const SalesManagerTable = ({ salesManagers, onPasswordReset, onToggleStatus, onUpdateNotes, onUpdateProfile }) => {
    // Toggle enable/disable
    const [togglingStatus, setTogglingStatus] = useState({});

    // Reset password
    const [resetId, setResetId] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Edit profile (inline row editing)
    const [editingProfile, setEditingProfile] = useState({});
    const [profileDrafts, setProfileDrafts] = useState({});
    const [savingProfile, setSavingProfile] = useState({});
    const [profileErrors, setProfileErrors] = useState({});

    // Notes — auto-save via debounce
    const [noteDrafts, setNoteDrafts] = useState({});
    const [noteStatus, setNoteStatus] = useState({}); // 'saving' | 'saved' | ''
    const debounceTimers = useRef({});
    const formatDate = (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString();
    };
    const formatDateTime = (value) => {
        if (!value) return 'Never';
        return new Date(value).toLocaleString();
    };

    // ── Toggle handler ───────────────────────────────────────────
    const handleToggle = async (id) => {
        setTogglingStatus(prev => ({ ...prev, [id]: true }));
        try {
            await onToggleStatus(id);
        } finally {
            setTogglingStatus(prev => ({ ...prev, [id]: false }));
        }
    };

    // ── Reset password ───────────────────────────────────────────
    const handleReset = (id) => {
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        onPasswordReset(id, newPassword);
        setResetId('');
        setNewPassword('');
    };

    // ── Profile edit ─────────────────────────────────────────────
    const startEditProfile = (manager) => {
        setProfileDrafts(prev => ({
            ...prev,
            [manager._id]: {
                name: manager.name || '',
                email: manager.email || '',
                packageStartDate: manager.packageStartDate ? manager.packageStartDate.slice(0, 10) : '',
                packageEndDate: manager.packageEndDate ? manager.packageEndDate.slice(0, 10) : '',
            },
        }));
        setProfileErrors(prev => ({ ...prev, [manager._id]: '' }));
        setEditingProfile(prev => ({ ...prev, [manager._id]: true }));
    };

    const cancelEditProfile = (id) => {
        setEditingProfile(prev => ({ ...prev, [id]: false }));
        setProfileErrors(prev => ({ ...prev, [id]: '' }));
    };

    const handleSaveProfile = async (id) => {
        const draft = profileDrafts[id] || {};
        if (!draft.name?.trim()) {
            setProfileErrors(prev => ({ ...prev, [id]: 'Name is required' }));
            return;
        }
        if (!draft.email?.trim()) {
            setProfileErrors(prev => ({ ...prev, [id]: 'Email is required' }));
            return;
        }
        setSavingProfile(prev => ({ ...prev, [id]: true }));
        setProfileErrors(prev => ({ ...prev, [id]: '' }));
        try {
            await onUpdateProfile(id, {
                name: draft.name.trim(),
                email: draft.email.trim(),
                packageStartDate: draft.packageStartDate || null,
                packageEndDate: draft.packageEndDate || null,
            });
            setEditingProfile(prev => ({ ...prev, [id]: false }));
        } catch {
            // error shown via alert in AdminDashboard
        } finally {
            setSavingProfile(prev => ({ ...prev, [id]: false }));
        }
    };

    // ── Notes: auto-save with 1.2s debounce ─────────────────────
    const handleNoteChange = useCallback((id, value) => {
        setNoteDrafts(prev => ({ ...prev, [id]: value }));
        setNoteStatus(prev => ({ ...prev, [id]: '' }));

        if (debounceTimers.current[id]) {
            clearTimeout(debounceTimers.current[id]);
        }

        debounceTimers.current[id] = setTimeout(async () => {
            setNoteStatus(prev => ({ ...prev, [id]: 'saving' }));
            try {
                await onUpdateNotes(id, value);
                setNoteStatus(prev => ({ ...prev, [id]: 'saved' }));
                // Clear "Saved" indicator after 2s
                setTimeout(() => {
                    setNoteStatus(prev => ({ ...prev, [id]: '' }));
                }, 2000);
            } catch {
                setNoteStatus(prev => ({ ...prev, [id]: 'error' }));
            }
        }, 1200);
    }, [onUpdateNotes]);

    if (salesManagers.length === 0) {
        return (
            <div className="text-center text-muted" style={{ padding: '2rem' }}>
                No sales managers created yet
            </div>
        );
    }

    return (
        <div className="sm-table-outer">
            <table className="sm-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Package Start</th>
                        <th>Package End</th>
                        <th>Plan Alert</th>
                        <th>Last Login</th>
                        <th>Notes</th>
                        <th>Actions</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {salesManagers.map((manager) => (
                        <>
                            {/* ── Main Data Row ── */}
                            <tr
                                key={manager._id}
                                className={manager.isEnabled === false ? 'sm-row--disabled' : ''}
                            >
                                {/* User ID */}
                                <td>
                                    <span className="badge badge-primary">{manager.userId}</span>
                                </td>

                                {/* Name */}
                                <td>
                                    {editingProfile[manager._id] ? (
                                        <input
                                            type="text"
                                            className="sm-inline-input sm-inline-input--tall"
                                            value={profileDrafts[manager._id]?.name || ''}
                                            onChange={(e) =>
                                                setProfileDrafts(prev => ({
                                                    ...prev,
                                                    [manager._id]: { ...prev[manager._id], name: e.target.value },
                                                }))
                                            }
                                            placeholder="Full name"
                                        />
                                    ) : (
                                        <span
                                            className="sm-cell-text"
                                        >
                                            {manager.name || <em className="text-muted">—</em>}
                                        </span>
                                    )}
                                </td>

                                {/* Email */}
                                <td>
                                    {editingProfile[manager._id] ? (
                                        <input
                                            type="email"
                                            className="sm-inline-input"
                                            value={profileDrafts[manager._id]?.email || ''}
                                            onChange={(e) =>
                                                setProfileDrafts(prev => ({
                                                    ...prev,
                                                    [manager._id]: { ...prev[manager._id], email: e.target.value },
                                                }))
                                            }
                                            placeholder="Email address"
                                        />
                                    ) : (
                                        <span className="sm-cell-text">{manager.email || <em className="text-muted">—</em>}</span>
                                    )}
                                </td>

                                {/* Status Toggle */}
                                <td>
                                    <label className="sm-toggle" title={manager.isEnabled === false ? 'Enable manager' : 'Disable manager'}>
                                        <input
                                            type="checkbox"
                                            checked={manager.isEnabled !== false}
                                            disabled={togglingStatus[manager._id]}
                                            onChange={() => handleToggle(manager._id)}
                                        />
                                        <span className="sm-toggle__track">
                                            <span className="sm-toggle__thumb" />
                                        </span>
                                    </label>
                                </td>

                                <td className="sm-date-cell">
                                    {editingProfile[manager._id] ? (
                                        <input
                                            type="date"
                                            className="sm-inline-input"
                                            value={profileDrafts[manager._id]?.packageStartDate || ''}
                                            onChange={(e) =>
                                                setProfileDrafts(prev => ({
                                                    ...prev,
                                                    [manager._id]: { ...prev[manager._id], packageStartDate: e.target.value },
                                                }))
                                            }
                                        />
                                    ) : (
                                        formatDate(manager.packageStartDate)
                                    )}
                                </td>

                                <td className="sm-date-cell">
                                    {editingProfile[manager._id] ? (
                                        <input
                                            type="date"
                                            className="sm-inline-input"
                                            value={profileDrafts[manager._id]?.packageEndDate || ''}
                                            onChange={(e) =>
                                                setProfileDrafts(prev => ({
                                                    ...prev,
                                                    [manager._id]: { ...prev[manager._id], packageEndDate: e.target.value },
                                                }))
                                            }
                                        />
                                    ) : (
                                        formatDate(manager.packageEndDate)
                                    )}
                                </td>

                                <td>
                                    {manager.plan?.isExpired ? (
                                        <span className="sm-plan-badge sm-plan-badge--expired">Expired</span>
                                    ) : manager.plan?.isExpiringSoon ? (
                                        <span className="sm-plan-badge sm-plan-badge--warning">
                                            {manager.plan.daysLeft} day{manager.plan.daysLeft === 1 ? '' : 's'} left
                                        </span>
                                    ) : (
                                        <span className="sm-plan-badge sm-plan-badge--ok">Active</span>
                                    )}
                                </td>

                                <td className="sm-date-cell">{formatDateTime(manager.lastLoginAt)}</td>

                                {/* Notes — auto-save textarea */}
                                <td className="sm-notes-cell">
                                    <div className="sm-notes-wrap">
                                        <textarea
                                            className="sm-notes-ta"
                                            rows={2}
                                            placeholder="Write notes…"
                                            value={noteDrafts[manager._id] ?? manager.notes ?? ''}
                                            onChange={(e) => handleNoteChange(manager._id, e.target.value)}
                                        />
                                        <span className={`sm-note-status sm-note-status--${noteStatus[manager._id] || 'idle'}`}>
                                            {noteStatus[manager._id] === 'saving' && '⏳ Saving…'}
                                            {noteStatus[manager._id] === 'saved' && '✓ Saved'}
                                            {noteStatus[manager._id] === 'error' && '✕ Error'}
                                        </span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td>
                                    <div className="sm-actions-cell">
                                        {editingProfile[manager._id] ? (
                                            <>
                                                {profileErrors[manager._id] && (
                                                    <span className="sm-profile-error">{profileErrors[manager._id]}</span>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleSaveProfile(manager._id)}
                                                    disabled={savingProfile[manager._id]}
                                                >
                                                    {savingProfile[manager._id] ? 'Saving…' : 'Save'}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => cancelEditProfile(manager._id)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : resetId === manager._id ? (
                                            <>
                                                <input
                                                    type="password"
                                                    className="sm-inline-input"
                                                    placeholder="New password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    style={{ width: '130px' }}
                                                />
                                                <button
                                                    className="btn btn-sm btn-accent"
                                                    onClick={() => handleReset(manager._id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => { setResetId(''); setNewPassword(''); }}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => startEditProfile(manager)}
                                                    title="Edit name & email"
                                                >
                                                    ✎ Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => setResetId(manager._id)}
                                                    title="Reset password"
                                                >
                                                    🔑 Reset Pwd
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>

                                {/* Created date */}
                                <td className="sm-date-cell">
                                    {new Date(manager.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesManagerTable;
