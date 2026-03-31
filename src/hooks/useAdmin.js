import { useState, useCallback, useEffect } from 'react';

export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

export const useUsers = (fetchUsers) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchUsers(page, debouncedSearch);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, fetchUsers]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return {
        users,
        loading,
        error,
        page,
        setPage,
        totalPages,
        search,
        setSearch,
        refresh: loadUsers
    };
};

export const useFormValidation = (initialState, validationRules) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validate = useCallback((name, value) => {
        const rules = validationRules[name];
        if (!rules) return '';

        for (const rule of rules) {
            const error = rule(value, values);
            if (error) return error;
        }
        return '';
    }, [validationRules, values]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        
        if (touched[name]) {
            const error = validate(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    }, [touched, validate]);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validate(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    }, [validate]);

    const reset = useCallback(() => {
        setValues(initialState);
        setErrors({});
        setTouched({});
    }, [initialState]);

    const validateAll = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(name => {
            const error = validate(name, values[name]);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        return isValid;
    }, [validate, validationRules, values]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        reset,
        validateAll,
        setValues,
        isValid: Object.keys(errors).length === 0
    };
};

export const useApi = () => {
    const [state, setState] = useState({
        data: null,
        loading: false,
        error: null
    });

    const execute = useCallback(async (apiCall) => {
        setState({ data: null, loading: true, error: null });
        try {
            const response = await apiCall();
            setState({ data: response.data, loading: false, error: null });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
            setState({ data: null, loading: false, error: errorMessage });
            throw err;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return { ...state, execute, reset };
};
