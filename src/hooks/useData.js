import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useHabits() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHabits = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/habits?active=true');
            if (response.data.success) {
                setHabits(response.data.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createHabit = async (data) => {
        try {
            const response = await api.post('/habits', data);
            if (response.data.success) {
                await fetchHabits();
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to create habit' };
        }
    };

    const deleteHabit = async (id) => {
        try {
            await api.delete(`/habits/${id}`);
            await fetchHabits();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    return { habits, loading, error, fetchHabits, createHabit, deleteHabit };
}

export function useSquads() {
    const [squads, setSquads] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSquads = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/squads');
            if (response.data.success) {
                setSquads(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createSquad = async (name) => {
        try {
            const response = await api.post('/squads', { squad_name: name, squad_type: 'public' });
            if (response.data.success) {
                await fetchSquads();
                return { success: true, data: response.data.data };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to create squad' };
        }
    }

    const joinSquad = async (id) => {
        try {
            const response = await api.post(`/squads/${id}/join`);
            if (response.data.success) {
                await fetchSquads();
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to join squad' };
        }
    }

    return { squads, loading, fetchSquads, createSquad, joinSquad };
}

export function useHabitDetails(habitId) {
    const [habit, setHabit] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchHabit = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/habits/${habitId}`);
            if (response.data.success) {
                setHabit(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [habitId]);

    useEffect(() => {
        if (habitId) fetchHabit();
    }, [habitId]);

    return { habit, loading, fetchHabit };
}

export function useSquadDetails(squadId) {
    const [squad, setSquad] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSquad = useCallback(async () => {
        try {
            setLoading(true);
            const [squadRes, membersRes] = await Promise.all([
                api.get(`/squads/${squadId}`),
                api.get(`/squads/${squadId}/members`)
            ]);

            if (squadRes.data.success) setSquad(squadRes.data.data);
            if (membersRes.data.success) setMembers(membersRes.data.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [squadId]);

    useEffect(() => {
        if (squadId) fetchSquad();
    }, [squadId]);

    const inviteUser = async (username) => {
        try {
            // First search for user to get ID
            const searchRes = await api.get(`/users?username=${username}`);
            if (searchRes.data.success && searchRes.data.data.length > 0) {
                const userId = searchRes.data.data[0].id;
                const inviteRes = await api.post(`/squads/${squadId}/invite`, { userId });
                return { success: true };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to invite' };
        }
    }

    return { squad, members, loading, fetchSquad, inviteUser };
}

export function useCompletions() {
    const toggleCompletion = async (habitId, date = new Date().toISOString().split('T')[0]) => {
        try {
            const response = await api.post('/completions/toggle', { habit_id: habitId, date });
            return { success: true, data: response.data.data };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to toggle completion' };
        }
    }

    return { toggleCompletion };
}

export function useUserStats() {
    const [stats, setStats] = useState({ streak: 0, completion_rate: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/completions/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, fetchStats };
}
