import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingBanner = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberCount, setMemberCount] = useState(0);

  // Constants
  const totalShares = 149;
  const shareValue = 4027;
  const fundingTarget = 600_000;

  // Derived values
  const fundedAmount = memberCount * shareValue;
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
      <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-8 text-center">
        Loading project stats…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-red-100 p-8 rounded-2xl shadow-lg mb-8 text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-gray-900">CBIRE0001 Project</h3>
        <p className="text-gray-700 mt-1">
          CBIRE0001 is the first community-led development from CBI Members
        </p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-gray-700">
        <div>
          <p><span className="font-semibold">Units:</span> 2 × 1 Bed, 1 × 2 Bed</p>
          <p className="mt-1"><span className="font-semibold">Model:</span> Build-To-Let, 3-Year Lock-In</p>
          <p className="mt-1"><span className="font-semibold">Target Yield:</span> 10% P.A.</p>
        </div>
        <div>
          <p><span className="font-semibold">Total Shares:</span> {totalShares}</p>
          <p className="mt-1"><span className="font-semibold">Share Value:</span> €{shareValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Funding progress */}
      <div className="mb-2 text-gray-800">
        <span className="font-semibold">Funding:</span> €{fundedAmount.toLocaleString()} of €{fundingTarget.toLocaleString()} ({fundsPct}%)
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${fundsPct}%` }}
          transition={{ duration: 0.7 }}
        />
      </div>
    </div>
  );
};

export default LoadingBanner;
