import React, { useState, useEffect } from 'react';
import { 
    Clock, Play, Pause, Plus, Edit, Trash2, RefreshCw, 
    Calendar, Globe, Zap, CheckCircle, AlertTriangle, X,
    ChevronRight, ToggleLeft, ToggleRight, Search, Filter
} from 'lucide-react';
import { scanApi } from '../../services/api';
import { Button, Card, Input, Modal } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import { useToast } from '../../contexts/ToastContext';
import './ScheduledScans.css';

const CRON_PRESETS = [
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every 6 hours', value: '0 */6 * * *' },
    { label: 'Daily at midnight', value: '0 0 * * *' },
    { label: 'Daily at 6am', value: '0 6 * * *' },
    { label: 'Weekly (Sunday)', value: '0 0 * * 0' },
    { label: 'Monthly', value: '0 0 1 * *' },
];

const SCAN_TYPES = [
    { value: 'quick', label: 'Quick Scan', desc: 'Fast scan for basic vulnerabilities' },
    { value: 'standard', label: 'Standard Scan', desc: 'Comprehensive scan with all modules' },
    { value: 'deep', label: 'Deep Scan', desc: 'Extensive scan with maximum coverage' },
];

const ScheduledScans = () => {
    const toast = useToast();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        targetUrl: '',
        scanType: 'standard',
        scheduleCron: '0 0 * * *',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        modules: ['owasp'],
        isEnabled: true
    });

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        setLoading(true);
        try {
            const response = await scanApi.getSchedules();
            setSchedules(response.data.schedules || []);
        } catch (error) {
            console.error('Failed to load schedules:', error);
            toast.error('Failed to load scheduled scans');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingSchedule) {
                await scanApi.updateSchedule(editingSchedule.id, formData);
                toast.success('Schedule updated successfully');
            } else {
                await scanApi.createSchedule(formData);
                toast.success('Schedule created successfully');
            }
            setShowModal(false);
            setEditingSchedule(null);
            resetForm();
            loadSchedules();
        } catch (error) {
            console.error('Failed to save schedule:', error);
            toast.error(error.response?.data?.error || 'Failed to save schedule');
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            name: schedule.name,
            targetUrl: schedule.target_url,
            scanType: schedule.scan_type,
            scheduleCron: schedule.schedule_cron,
            timezone: schedule.timezone,
            modules: typeof schedule.modules === 'string' ? JSON.parse(schedule.modules) : schedule.modules,
            isEnabled: schedule.is_enabled
        });
        setShowModal(true);
    };

    const handleDelete = async (scheduleId) => {
        if (!window.confirm('Delete this scheduled scan?')) return;
        
        try {
            await scanApi.deleteSchedule(scheduleId);
            toast.success('Schedule deleted');
            loadSchedules();
        } catch (error) {
            toast.error('Failed to delete schedule');
        }
    };

    const handleToggle = async (schedule) => {
        try {
            await scanApi.updateSchedule(schedule.id, { isEnabled: !schedule.is_enabled });
            loadSchedules();
        } catch (error) {
            toast.error('Failed to update schedule');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            targetUrl: '',
            scanType: 'standard',
            scheduleCron: '0 0 * * *',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            modules: ['owasp'],
            isEnabled: true
        });
    };

    const formatCron = (cron) => {
        const preset = CRON_PRESETS.find(p => p.value === cron);
        if (preset) return preset.label;
        
        const parts = cron.split(' ');
        if (parts[3] === '*' && parts[4] === '*') return 'Daily';
        if (parts[4] !== '*' && parts[3] === '*') return `Weekly on day ${parts[4]}`;
        return cron;
    };

    const formatNextRun = (date) => {
        if (!date) return 'Not scheduled';
        return new Date(date).toLocaleString();
    };

    const formatLastRun = (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleString();
    };

    return (
        <PageContainer
            title="Scheduled Scans"
            subtitle="Automate your vulnerability scanning"
        >
            <div className="scheduled-scans-page">
                <Card className="schedules-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h2><Clock size={20} /> Scheduled Scans</h2>
                            <p>Automate vulnerability scans on a recurring schedule</p>
                        </div>
                        <div className="header-actions">
                            <Button
                                variant="secondary"
                                leftIcon={<RefreshCw size={16} />}
                                onClick={loadSchedules}
                            >
                                Refresh
                            </Button>
                            <Button
                                leftIcon={<Plus size={16} />}
                                onClick={() => { resetForm(); setShowModal(true); }}
                            >
                                New Schedule
                            </Button>
                        </div>
                    </div>
                </Card>

                {loading ? (
                    <Card className="loading-card">
                        <RefreshCw className="animate-spin" size={24} />
                        <p>Loading schedules...</p>
                    </Card>
                ) : schedules.length === 0 ? (
                    <Card className="empty-card">
                        <Clock size={48} />
                        <h3>No scheduled scans</h3>
                        <p>Create a schedule to automate your vulnerability scanning</p>
                        <Button
                            leftIcon={<Plus size={16} />}
                            onClick={() => { resetForm(); setShowModal(true); }}
                        >
                            Create First Schedule
                        </Button>
                    </Card>
                ) : (
                    <div className="schedules-grid">
                        {schedules.map(schedule => (
                            <Card key={schedule.id} className={`schedule-card ${!schedule.is_enabled ? 'disabled' : ''}`}>
                                <div className="schedule-header">
                                    <div className="schedule-info">
                                        <h3>{schedule.name}</h3>
                                        <span className={`status-badge ${schedule.is_enabled ? 'active' : 'paused'}`}>
                                            {schedule.is_enabled ? 'Active' : 'Paused'}
                                        </span>
                                    </div>
                                    <button 
                                        className={`toggle-btn ${schedule.is_enabled ? 'on' : 'off'}`}
                                        onClick={() => handleToggle(schedule)}
                                        title={schedule.is_enabled ? 'Pause schedule' : 'Resume schedule'}
                                    >
                                        {schedule.is_enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                    </button>
                                </div>

                                <div className="schedule-details">
                                    <div className="detail-row">
                                        <Globe size={16} />
                                        <span>{schedule.target_url}</span>
                                    </div>
                                    <div className="detail-row">
                                        <Clock size={16} />
                                        <span>{formatCron(schedule.schedule_cron)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <Zap size={16} />
                                        <span>{schedule.scan_type} scan</span>
                                    </div>
                                </div>

                                <div className="schedule-timing">
                                    <div className="timing-item">
                                        <span className="timing-label">Next Run</span>
                                        <span className="timing-value">{formatNextRun(schedule.next_run_at)}</span>
                                    </div>
                                    <div className="timing-item">
                                        <span className="timing-label">Last Run</span>
                                        <span className="timing-value">{formatLastRun(schedule.last_run_at)}</span>
                                    </div>
                                </div>

                                <div className="schedule-actions">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        leftIcon={<Edit size={14} />}
                                        onClick={() => handleEdit(schedule)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="small"
                                        leftIcon={<Trash2 size={14} />}
                                        onClick={() => handleDelete(schedule.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditingSchedule(null); resetForm(); }}
                title={editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
            >
                <form onSubmit={handleSubmit} className="schedule-form">
                    <div className="form-group">
                        <label>Schedule Name *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Daily Security Scan"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Target URL *</label>
                        <Input
                            value={formData.targetUrl}
                            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                            placeholder="https://example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Schedule Frequency</label>
                        <div className="cron-presets">
                            {CRON_PRESETS.map(preset => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    className={`preset-btn ${formData.scheduleCron === preset.value ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, scheduleCron: preset.value })}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <Input
                            value={formData.scheduleCron}
                            onChange={(e) => setFormData({ ...formData, scheduleCron: e.target.value })}
                            placeholder="0 0 * * *"
                            pattern="^([0-9*,/-]+ ){4}[0-9*,/-]+$"
                        />
                        <span className="form-hint">Cron expression (minute hour day month weekday)</span>
                    </div>

                    <div className="form-group">
                        <label>Timezone</label>
                        <select
                            value={formData.timezone}
                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                            className="form-select"
                        >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Scan Type</label>
                        <div className="scan-type-options">
                            {SCAN_TYPES.map(type => (
                                <label
                                    key={type.value}
                                    className={`scan-type-option ${formData.scanType === type.value ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="scanType"
                                        value={type.value}
                                        checked={formData.scanType === type.value}
                                        onChange={(e) => setFormData({ ...formData, scanType: e.target.value })}
                                    />
                                    <div className="scan-type-content">
                                        <span className="scan-type-label">{type.label}</span>
                                        <span className="scan-type-desc">{type.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button variant="secondary" type="button" onClick={() => { setShowModal(false); setEditingSchedule(null); }}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default ScheduledScans;
