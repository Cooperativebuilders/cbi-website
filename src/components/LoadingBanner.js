import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingBanner = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberCount, setMemberCount] = useState(0);

  // Constants
  const totalShares = 149;        // Total possible CBIRE0001 shares
  const shareValue = 4027;       // EUR per share
  const fundingTarget = 600_000; // EUR funding goal

  // Derived values
  const fundedAmount = memberCount * shareValue;
  const sharesPct = totalShares
    ? Math.min(100, Math.floor((memberCount / totalShares) * 100))
    : 0;
  const fundsPct = fundingTarget
    ? Math.min(100, Math.floor((fundedAmount / fundingTarget) * 100))
    : 0;

  useEffect(() => {
    let mounted = true;

    async function fetchCount() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          'https://cbi-backend-l001.onrender.com/api/discord-role-counts'
        );
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Unknown error');

        const count = json.data.CBIRE0001 || 0;
        if (mounted) setMemberCount(count);
      } catch (err) {
        console.error('LoadingBanner fetch error', err);
        if (mounted) setError('Failed to load banner data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mb-8 text-center">
        Loading project stats…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-red-100 p-6 rounded-xl shadow-md mb-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mb-8">
      {/* Project Header */}
      <h3 className="text-2xl font-bold text-gray-800 mb-1">
        CBIRE0001 Project
      </h3>
      <p className="text-gray-600 mb-1">
        CBIRE0001 is the first community-led development from CBI Members
      </p>
      <p className="text-gray-600 mb-4">
        Units: 2 x 1 Bed, 1 x 2 Bed
      </p>
      <p className="text-gray-600 mb-4">
        Build-To-Let Model with 3 Year Lock In Period
      </p>
      <p className="text-gray-600 mb-6">
        Target Yield: 10% P.A.
      </p>

      {/* Static info */}
      <div className="flex justify-between mb-4 text-gray-700">
        <div>
          <div className="text-sm">Total Shares</div>
          <div className="font-semibold">{totalShares}</div>
        </div>
        <div>
          <div className="text-sm">Share Value</div>
          <div className="font-semibold">€{shareValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Shares progress */}
      <div className="mb-2 text-gray-800">
        Shares Funded: <span className="font-semibold">{memberCount}</span> of{' '}
        <span className="font-semibold">{totalShares}</span> ({sharesPct}%)
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${sharesPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Funding progress */}
      <div className="mb-2 text-gray-800">
        Funding: <span className="font-semibold">€{fundedAmount.toLocaleString()}</span> of{' '}
        <span className="font-semibold">€{fundingTarget.toLocaleString()}</span> ({fundsPct}%)
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <motion.div
          className="h-full bg-green-600"
          initial={{ width: 0 }}
          animate={{ width: `${fundsPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default LoadingBanner;
