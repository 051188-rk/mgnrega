const express = require('express');
const router = express.Router();
const DistrictSnapshot = require('../models/DistrictSnapshot');

// Get fund utilization data for a district
router.get('/fund-utilization/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const { months = 12 } = req.query;

    const snapshots = await DistrictSnapshot.find({
      district_code: districtCode,
      total_funds_released: { $gt: 0 },
      total_funds_utilized: { $gt: 0 }
    })
    .sort({ period_key: -1 })
    .limit(parseInt(months));

    const data = snapshots.reverse().map(snap => ({
      date: snap.period_key,
      released: snap.total_funds_released,
      utilized: snap.total_funds_utilized,
      utilizationRate: (snap.total_funds_utilized / snap.total_funds_released) * 100
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching fund utilization:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch fund utilization data' });
  }
});

// Get top 10 districts by expenditure for comparison
router.get('/top-expenditures/:stateCode', async (req, res) => {
  try {
    const { stateCode } = req.params;
    const { limit = 10 } = req.query;

    const latestPeriod = await DistrictSnapshot.findOne({ state_code: stateCode })
      .sort({ period_key: -1 })
      .select('period_key')
      .lean();

    if (!latestPeriod) {
      return res.json({ success: true, data: [] });
    }

    const topDistricts = await DistrictSnapshot.aggregate([
      { $match: { 
        state_code: stateCode,
        period_key: latestPeriod.period_key,
        total_expenditure: { $gt: 0 }
      }},
      { $sort: { total_expenditure: -1 } },
      { $limit: parseInt(limit) },
      { $project: {
        _id: 0,
        district_code: 1,
        district_name: 1,
        total_expenditure: 1,
        person_days_generated: 1,
        avg_wage_paid: {
          $cond: [
            { $gt: ['$person_days_generated', 0] },
            { $divide: ['$total_wage_paid', '$person_days_generated'] },
            0
          ]
        }
      }}
    ]);

    res.json({ success: true, data: topDistricts });
  } catch (error) {
    console.error('Error fetching top expenditures:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch expenditure data' });
  }
});

// Get wage statistics
router.get('/wage-stats/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const { months = 12 } = req.query;

    const snapshots = await DistrictSnapshot.find({
      district_code: districtCode,
      person_days_generated: { $gt: 0 },
      total_wage_paid: { $gt: 0 }
    })
    .sort({ period_key: -1 })
    .limit(parseInt(months));

    const wageStats = {
      current: 0,
      previous: 0,
      change: 0
    };

    if (snapshots.length > 0) {
      wageStats.current = snapshots[0].total_wage_paid / snapshots[0].person_days_generated;
      
      if (snapshots.length > 1) {
        wageStats.previous = snapshots[1].total_wage_paid / snapshots[1].person_days_generated;
        wageStats.change = ((wageStats.current - wageStats.previous) / wageStats.previous) * 100;
      }
    }

    res.json({ success: true, data: wageStats });
  } catch (error) {
    console.error('Error fetching wage stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wage statistics' });
  }
});

module.exports = router;
