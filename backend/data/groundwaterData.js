const groundwaterData = [
  {
    villageId: 'V001', aquiferType: 'Vidhisha', wellCount: 4,
    currentDepthMeters: 18.4, preMonsoonDepthMeters: 12.2, postMonsoonDepthMeters: 7.8,
    depletionRateMetersPerMonth: 1.8,
    monthlyReadings: [
      { month: 'Oct-24', depth: 7.8 }, { month: 'Nov-24', depth: 9.2 },
      { month: 'Dec-24', depth: 11.5 }, { month: 'Jan-25', depth: 13.8 },
      { month: 'Feb-25', depth: 16.1 }, { month: 'Mar-25', depth: 18.4 }
    ],
    criticalDepthMeters: 25.0, rechargeZone: 'Low', lastInspectionDate: '2025-03-10', wellCondition: 'Operational'
  },
  {
    villageId: 'V003', aquiferType: 'Dindori', wellCount: 2,
    currentDepthMeters: 22.1, preMonsoonDepthMeters: 15.0, postMonsoonDepthMeters: 9.5,
    depletionRateMetersPerMonth: 2.4,
    monthlyReadings: [
      { month: 'Oct-24', depth: 9.5 }, { month: 'Nov-24', depth: 11.8 },
      { month: 'Dec-24', depth: 15.0 }, { month: 'Jan-25', depth: 17.8 },
      { month: 'Feb-25', depth: 20.1 }, { month: 'Mar-25', depth: 22.1 }
    ],
    criticalDepthMeters: 25.0, rechargeZone: 'Low', lastInspectionDate: '2025-02-28', wellCondition: 'Degraded'
  },
  {
    villageId: 'V015', aquiferType: 'Gondwana Sandstone', wellCount: 6,
    currentDepthMeters: 14.2, preMonsoonDepthMeters: 10.5, postMonsoonDepthMeters: 5.2,
    depletionRateMetersPerMonth: 1.1,
    monthlyReadings: [
      { month: 'Oct-24', depth: 5.2 }, { month: 'Nov-24', depth: 7.0 },
      { month: 'Dec-24', depth: 9.1 }, { month: 'Jan-25', depth: 11.0 },
      { month: 'Feb-25', depth: 12.8 }, { month: 'Mar-25', depth: 14.2 }
    ],
    criticalDepthMeters: 30.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-04', wellCondition: 'Operational'
  },
  {
    villageId: 'V007', aquiferType: 'Mandla', wellCount: 5,
    currentDepthMeters: 20.1, preMonsoonDepthMeters: 13.7, postMonsoonDepthMeters: 8.9,
    depletionRateMetersPerMonth: 2.0,
    monthlyReadings: [
      { month: 'Oct-24', depth: 8.9 }, { month: 'Nov-24', depth: 10.5 },
      { month: 'Dec-24', depth: 12.6 }, { month: 'Jan-25', depth: 15.0 },
      { month: 'Feb-25', depth: 17.2 }, { month: 'Mar-25', depth: 20.1 }
    ],
    criticalDepthMeters: 25.0, rechargeZone: 'Low', lastInspectionDate: '2025-03-01', wellCondition: 'Degraded'
  },
  {
    villageId: 'V009', aquiferType: 'Pipra', wellCount: 3,
    currentDepthMeters: 23.5, preMonsoonDepthMeters: 16.2, postMonsoonDepthMeters: 10.3,
    depletionRateMetersPerMonth: 2.8,
    monthlyReadings: [
      { month: 'Oct-24', depth: 10.3 }, { month: 'Nov-24', depth: 12.8 },
      { month: 'Dec-24', depth: 15.9 }, { month: 'Jan-25', depth: 18.5 },
      { month: 'Feb-25', depth: 20.9 }, { month: 'Mar-25', depth: 23.5 }
    ],
    criticalDepthMeters: 25.0, rechargeZone: 'Low', lastInspectionDate: '2025-02-20', wellCondition: 'Dry'
  },
  {
    villageId: 'V013', aquiferType: 'Alluvial', wellCount: 3,
    currentDepthMeters: 22.0, preMonsoonDepthMeters: 14.5, postMonsoonDepthMeters: 8.6,
    depletionRateMetersPerMonth: 2.0,
    monthlyReadings: [
      { month: 'Oct-24', depth: 8.6 }, { month: 'Nov-24', depth: 11.0 },
      { month: 'Dec-24', depth: 13.6 }, { month: 'Jan-25', depth: 16.1 },
      { month: 'Feb-25', depth: 19.1 }, { month: 'Mar-25', depth: 22.0 }
    ],
    criticalDepthMeters: 24.0, rechargeZone: 'Low', lastInspectionDate: '2025-02-15', wellCondition: 'Dry'
  },
  {
    villageId: 'V002', aquiferType: 'Deccan Basalt', wellCount: 4,
    currentDepthMeters: 12.6, preMonsoonDepthMeters: 9.2, postMonsoonDepthMeters: 6.1,
    depletionRateMetersPerMonth: 1.2,
    monthlyReadings: [ { month: 'Oct-24', depth: 6.1 }, { month: 'Nov-24', depth: 7.3 }, { month: 'Dec-24', depth: 8.4 }, { month: 'Jan-25', depth: 9.5 }, { month: 'Feb-25', depth: 11.0 }, { month: 'Mar-25', depth: 12.6 } ],
    criticalDepthMeters: 26.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-18', wellCondition: 'Operational'
  },
  {
    villageId: 'V004', aquiferType: 'Deccan Basalt', wellCount: 4,
    currentDepthMeters: 14.5, preMonsoonDepthMeters: 10.0, postMonsoonDepthMeters: 6.5,
    depletionRateMetersPerMonth: 1.5,
    monthlyReadings: [ { month: 'Oct-24', depth: 6.5 }, { month: 'Nov-24', depth: 8.0 }, { month: 'Dec-24', depth: 10.2 }, { month: 'Jan-25', depth: 11.8 }, { month: 'Feb-25', depth: 12.9 }, { month: 'Mar-25', depth: 14.5 } ],
    criticalDepthMeters: 26.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-20', wellCondition: 'Operational'
  },
  {
    villageId: 'V005', aquiferType: 'Deccan Basalt', wellCount: 2,
    currentDepthMeters: 16.0, preMonsoonDepthMeters: 11.3, postMonsoonDepthMeters: 7.2,
    depletionRateMetersPerMonth: 1.3,
    monthlyReadings: [ { month: 'Oct-24', depth: 7.2 }, { month: 'Nov-24', depth: 8.8 }, { month: 'Dec-24', depth: 10.5 }, { month: 'Jan-25', depth: 12.5 }, { month: 'Feb-25', depth: 14.1 }, { month: 'Mar-25', depth: 16.0 } ],
    criticalDepthMeters: 28.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-05', wellCondition: 'Operational'
  },
  {
    villageId: 'V006', aquiferType: 'Deccan Basalt', wellCount: 3,
    currentDepthMeters: 13.7, preMonsoonDepthMeters: 9.5, postMonsoonDepthMeters: 5.8,
    depletionRateMetersPerMonth: 1.4,
    monthlyReadings: [ { month: 'Oct-24', depth: 5.8 }, { month: 'Nov-24', depth: 7.1 }, { month: 'Dec-24', depth: 8.7 }, { month: 'Jan-25', depth: 10.4 }, { month: 'Feb-25', depth: 12.1 }, { month: 'Mar-25', depth: 13.7 } ],
    criticalDepthMeters: 27.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-15', wellCondition: 'Operational'
  },
  {
    villageId: 'V008', aquiferType: 'Deccan Basalt', wellCount: 3,
    currentDepthMeters: 11.3, preMonsoonDepthMeters: 7.5, postMonsoonDepthMeters: 4.4,
    depletionRateMetersPerMonth: 1.0,
    monthlyReadings: [ { month: 'Oct-24', depth: 4.4 }, { month: 'Nov-24', depth: 5.5 }, { month: 'Dec-24', depth: 6.7 }, { month: 'Jan-25', depth: 8.1 }, { month: 'Feb-25', depth: 9.5 }, { month: 'Mar-25', depth: 11.3 } ],
    criticalDepthMeters: 26.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-12', wellCondition: 'Operational'
  },
  {
    villageId: 'V010', aquiferType: 'Deccan Basalt', wellCount: 3,
    currentDepthMeters: 15.2, preMonsoonDepthMeters: 11.5, postMonsoonDepthMeters: 6.9,
    depletionRateMetersPerMonth: 1.6,
    monthlyReadings: [ { month: 'Oct-24', depth: 6.9 }, { month: 'Nov-24', depth: 8.3 }, { month: 'Dec-24', depth: 10.0 }, { month: 'Jan-25', depth: 11.9 }, { month: 'Feb-25', depth: 13.7 }, { month: 'Mar-25', depth: 15.2 } ],
    criticalDepthMeters: 27.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-19', wellCondition: 'Stressed'
  },
  {
    villageId: 'V011', aquiferType: 'Alluvial', wellCount: 4,
    currentDepthMeters: 12.8, preMonsoonDepthMeters: 9.1, postMonsoonDepthMeters: 5.7,
    depletionRateMetersPerMonth: 1.0,
    monthlyReadings: [ { month: 'Oct-24', depth: 5.7 }, { month: 'Nov-24', depth: 7.1 }, { month: 'Dec-24', depth: 8.4 }, { month: 'Jan-25', depth: 9.5 }, { month: 'Feb-25', depth: 11.2 }, { month: 'Mar-25', depth: 12.8 } ],
    criticalDepthMeters: 30.0, rechargeZone: 'High', lastInspectionDate: '2025-03-08', wellCondition: 'Operational'
  },
  {
    villageId: 'V012', aquiferType: 'Alluvial', wellCount: 2,
    currentDepthMeters: 13.3, preMonsoonDepthMeters: 9.8, postMonsoonDepthMeters: 6.3,
    depletionRateMetersPerMonth: 1.2,
    monthlyReadings: [ { month: 'Oct-24', depth: 6.3 }, { month: 'Nov-24', depth: 7.7 }, { month: 'Dec-24', depth: 9.2 }, { month: 'Jan-25', depth: 10.7 }, { month: 'Feb-25', depth: 12.0 }, { month: 'Mar-25', depth: 13.3 } ],
    criticalDepthMeters: 30.0, rechargeZone: 'High', lastInspectionDate: '2025-03-17', wellCondition: 'Operational'
  },
  {
    villageId: 'V014', aquiferType: 'Alluvial', wellCount: 4,
    currentDepthMeters: 10.9, preMonsoonDepthMeters: 7.1, postMonsoonDepthMeters: 4.8,
    depletionRateMetersPerMonth: 0.9,
    monthlyReadings: [ { month: 'Oct-24', depth: 4.8 }, { month: 'Nov-24', depth: 5.9 }, { month: 'Dec-24', depth: 7.2 }, { month: 'Jan-25', depth: 8.5 }, { month: 'Feb-25', depth: 9.7 }, { month: 'Mar-25', depth: 10.9 } ],
    criticalDepthMeters: 29.0, rechargeZone: 'High', lastInspectionDate: '2025-03-21', wellCondition: 'Operational'
  },
  {
    villageId: 'V016', aquiferType: 'Gondwana Sandstone', wellCount: 2,
    currentDepthMeters: 11.8, preMonsoonDepthMeters: 8.7, postMonsoonDepthMeters: 5.1,
    depletionRateMetersPerMonth: 0.9,
    monthlyReadings: [ { month: 'Oct-24', depth: 5.1 }, { month: 'Nov-24', depth: 6.2 }, { month: 'Dec-24', depth: 7.4 }, { month: 'Jan-25', depth: 8.6 }, { month: 'Feb-25', depth: 10.2 }, { month: 'Mar-25', depth: 11.8 } ],
    criticalDepthMeters: 30.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-16', wellCondition: 'Operational'
  },
  {
    villageId: 'V017', aquiferType: 'Gondwana Sandstone', wellCount: 5,
    currentDepthMeters: 18.0, preMonsoonDepthMeters: 12.3, postMonsoonDepthMeters: 7.2,
    depletionRateMetersPerMonth: 1.7,
    monthlyReadings: [ { month: 'Oct-24', depth: 7.2 }, { month: 'Nov-24', depth: 9.0 }, { month: 'Dec-24', depth: 11.4 }, { month: 'Jan-25', depth: 13.8 }, { month: 'Feb-25', depth: 16.1 }, { month: 'Mar-25', depth: 18.0 } ],
    criticalDepthMeters: 30.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-02-25', wellCondition: 'Stressed'
  },
  {
    villageId: 'V018', aquiferType: 'Gondwana Sandstone', wellCount: 3,
    currentDepthMeters: 13.8, preMonsoonDepthMeters: 10.2, postMonsoonDepthMeters: 6.1,
    depletionRateMetersPerMonth: 1.2,
    monthlyReadings: [ { month: 'Oct-24', depth: 6.1 }, { month: 'Nov-24', depth: 7.5 }, { month: 'Dec-24', depth: 9.1 }, { month: 'Jan-25', depth: 10.4 }, { month: 'Feb-25', depth: 12.1 }, { month: 'Mar-25', depth: 13.8 } ],
    criticalDepthMeters: 30.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-22', wellCondition: 'Operational'
  },
  {
    villageId: 'V019', aquiferType: 'Deccan Basalt', wellCount: 2,
    currentDepthMeters: 24.2, preMonsoonDepthMeters: 17.2, postMonsoonDepthMeters: 11.2,
    depletionRateMetersPerMonth: 2.3,
    monthlyReadings: [ { month: 'Oct-24', depth: 11.2 }, { month: 'Nov-24', depth: 13.9 }, { month: 'Dec-24', depth: 15.8 }, { month: 'Jan-25', depth: 18.4 }, { month: 'Feb-25', depth: 21.0 }, { month: 'Mar-25', depth: 24.2 } ],
    criticalDepthMeters: 25.0, rechargeZone: 'Low', lastInspectionDate: '2025-02-18', wellCondition: 'Degraded'
  },
  {
    villageId: 'V020', aquiferType: 'Deccan Basalt', wellCount: 3,
    currentDepthMeters: 14.9, preMonsoonDepthMeters: 10.7, postMonsoonDepthMeters: 7.1,
    depletionRateMetersPerMonth: 1.3,
    monthlyReadings: [ { month: 'Oct-24', depth: 7.1 }, { month: 'Nov-24', depth: 8.3 }, { month: 'Dec-24', depth: 10.0 }, { month: 'Jan-25', depth: 11.7 }, { month: 'Feb-25', depth: 13.2 }, { month: 'Mar-25', depth: 14.9 } ],
    criticalDepthMeters: 26.5, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-07', wellCondition: 'Operational'
  },
  {
    villageId: 'V021', aquiferType: 'Alluvial', wellCount: 6,
    currentDepthMeters: 11.0, preMonsoonDepthMeters: 7.8, postMonsoonDepthMeters: 4.9,
    depletionRateMetersPerMonth: 1.1,
    monthlyReadings: [ { month: 'Oct-24', depth: 4.9 }, { month: 'Nov-24', depth: 6.0 }, { month: 'Dec-24', depth: 7.3 }, { month: 'Jan-25', depth: 8.7 }, { month: 'Feb-25', depth: 10.1 }, { month: 'Mar-25', depth: 11.0 } ],
    criticalDepthMeters: 29.0, rechargeZone: 'High', lastInspectionDate: '2025-03-23', wellCondition: 'Operational'
  },
  {
    villageId: 'V022', aquiferType: 'Alluvial', wellCount: 2,
    currentDepthMeters: 16.4, preMonsoonDepthMeters: 12.0, postMonsoonDepthMeters: 8.4,
    depletionRateMetersPerMonth: 1.7,
    monthlyReadings: [ { month: 'Oct-24', depth: 8.4 }, { month: 'Nov-24', depth: 10.1 }, { month: 'Dec-24', depth: 11.6 }, { month: 'Jan-25', depth: 13.1 }, { month: 'Feb-25', depth: 14.6 }, { month: 'Mar-25', depth: 16.4 } ],
    criticalDepthMeters: 28.0, rechargeZone: 'Moderate', lastInspectionDate: '2025-03-02', wellCondition: 'Stressed'
  }
];

module.exports = { groundwaterData };
