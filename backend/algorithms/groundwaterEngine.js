function calculateAquiferHealth(gw) {
  const depthUsedPct = gw.currentDepthMeters / gw.criticalDepthMeters;
  const aquiferHealthScore = Math.max(0, Math.round((1 - depthUsedPct) * 100));

  const depthRemaining = gw.criticalDepthMeters - gw.currentDepthMeters;
  const daysUntilCritical = gw.depletionRateMetersPerMonth > 0
    ? Math.floor((depthRemaining / gw.depletionRateMetersPerMonth) * 30)
    : 999;

  let depletionStatus;
  if (aquiferHealthScore <= 15 || gw.wellCondition === 'Dry') depletionStatus = 'DEPLETED';
  else if (aquiferHealthScore <= 35) depletionStatus = 'CRITICAL';
  else if (aquiferHealthScore <= 60) depletionStatus = 'STRESSED';
  else depletionStatus = 'STABLE';

  const seasonalDrop = gw.currentDepthMeters - gw.postMonsoonDepthMeters;
  const recoveryRatio = gw.postMonsoonDepthMeters / gw.preMonsoonDepthMeters;

  return {
    ...gw,
    aquiferHealthScore,
    depletionStatus,
    daysUntilCritical,
    depthUsedPct: Math.round(depthUsedPct * 100),
    seasonalDrop: Number(seasonalDrop.toFixed(1)),
    recoveryRatio: Number(recoveryRatio.toFixed(2))
  };
}

module.exports = { calculateAquiferHealth };
