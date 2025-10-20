import { useState, useCallback } from 'react';
import api from '../services/api';

export function useIdentities() {
    const [identities, setIdentities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchIdentities = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/identities');
            if (response.data.success) {
                setIdentities(response.data.data);
            }
        } catch (err) {
            setError(err.message);
            console.error('Fetch identities error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createIdentity = async (data) => {
        try {
            const response = await api.post('/identities', data);
            if (response.data.success) {
                await fetchIdentities();
                return { success: true, data: response.data.data };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to create identity' };
        }
    };

    const updateIdentity = async (id, data) => {
        try {
            const response = await api.put(`/identities/${id}`, data);
            if (response.data.success) {
                await fetchIdentities();
                return { success: true, data: response.data.data };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to update identity' };
        }
    };

    const deleteIdentity = async (id) => {
        try {
            await api.delete(`/identities/${id}`);
            await fetchIdentities();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to delete identity' };
        }
    };

    return {
        identities,
        loading,
        error,
        fetchIdentities,
        createIdentity,
        updateIdentity,
        deleteIdentity
    };
}
