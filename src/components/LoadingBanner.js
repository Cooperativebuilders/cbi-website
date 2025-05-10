// src/components/LoadingBanner.js

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const LoadingBanner = () => {
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [distribution, setDistribution] = useState([]);
  const totalMembers = 149;

  const percentage = totalMembers > 0
    ? Math.min(100, Math.floor((memberCount / totalMembers) * 100))
    : 0;

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [countRes, distRes] = await Promise.all([
          axios.get('/api/role-count/CBIRE0001'),
          axios.get('/api/cbire0001-role-distribution'),
        ]);
        if (!mounted) return;
        setMemberCount(countRes.data.count);
        setDistribution(distRes.data.distribution);
      } catch (err) {
        console.error('LoadingBanner fetch error', err);
        if (mounted) setError('Failed to load banner data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
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
      {/* Overall CBIRE0001 progress */}
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

      {/* Distribution of CBIRE0001 members across other roles */}
      {distribution.length > 0 && (
        <div>
          <div className="text-md font-semibold text-gray-700 mb-2">
            CBIRE0001 Role Distribution
          </div>
          <div className="grid grid-cols-4 gap-4">
            {distribution.map(({ name, count }) => {
              const rp = totalMembers > 0
                ? Math.min(100, Math.floor((count / totalMembers) * 100))
                : 0;
              return (
                <div key={name} className="text-center">
                  <div className="text-sm text-gray-600 mb-1">{name}</div>
                  <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-green-500"
                      initial={{ height: 0 }}
                      animate={{ height: `${rp}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingBanner;
