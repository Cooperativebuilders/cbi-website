// src/components/LoadingBanner.js

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingBanner = () => {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const totalMembers = 149;

  const percentage = totalMembers > 0
    ? Math.min(100, Math.floor((memberCount / totalMembers) * 100))
    : 0;

  useEffect(() => {
    let mounted = true;

    const fetchCount = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/role-count/CBIRE0001');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { count } = await res.json();
        if (!mounted) return;
        setMemberCount(count);
      } catch (err) {
        console.error('LoadingBanner fetch error', err);
        if (mounted) setError('Failed to load banner data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-md mb-8 text-center">
        Loading project stats…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-red-100 p-4 rounded-xl shadow-md mb-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-md mb-8">
      <div className="mb-3 text-lg font-medium text-gray-800">
        Loaded <span className="font-semibold">{memberCount}</span> of{' '}
        <span className="font-semibold">{totalMembers}</span> members{' '}
        (<span className="text-blue-600">{percentage}%</span>)
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default LoadingBanner;
