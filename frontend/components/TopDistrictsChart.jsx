import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatNumber } from '../lib/utils';
import { getTopExpenditures } from '../lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TopDistrictsChart({ districtCode, stateCode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!stateCode) return;
      
      try {
        setLoading(true);
        const result = await getTopExpenditures(stateCode, 10);
        const districtsData = Array.isArray(result) ? result : (result.data || []);
        setData(districtsData);
        
        // Find and set the selected district's data
        if (districtCode) {
          const currentDistrict = districtsData.find(
            d => d.district_code === districtCode
          );
          setSelectedDistrict(currentDistrict || null);
        }
      } catch (err) {
        console.error('Error fetching top districts:', err);
        setError(err.message || 'Failed to fetch top districts data');
      } finally {
        setLoading(false);
      }
    };

    if (stateCode) {
      fetchData();
    }
  }, [districtCode, stateCode]);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading top districts data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!data || data.length === 0) return <div className="p-4 text-center text-gray-500">No district data available</div>;

  // Sort data by expenditure in descending order
  const sortedData = [...data].sort((a, b) => b.total_expenditure - a.total_expenditure);
  
  const chartData = {
    labels: sortedData.map(item => 
      item.district_name.length > 15 
        ? `${item.district_name.substring(0, 15)}...` 
        : item.district_name
    ),
    datasets: [
      {
        label: 'Total Expenditure (₹ Cr)',
        data: sortedData.map(item => item.total_expenditure / 10000000), // Convert to crores
        backgroundColor: sortedData.map(item => 
          item.district_code === districtCode 
            ? 'rgba(236, 72, 153, 0.8)' 
            : 'rgba(99, 102, 241, 0.6)'
        ),
        borderColor: sortedData.map(item => 
          item.district_code === districtCode 
            ? 'rgba(190, 24, 93, 1)' 
            : 'rgba(79, 70, 229, 1)'
        ),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 10 Districts by Expenditure',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const district = sortedData[context.dataIndex];
            const personDays = district.person_days_generated || 0;
            const avgWage = district.avg_wage_paid || 0;
            
            return [
              `Expenditure: ₹${formatNumber(context.raw)} Cr`,
              `Person Days: ${formatNumber(personDays)}`,
              `Avg. Wage: ₹${avgWage.toFixed(2)}/day`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Expenditure (₹ Cr)'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      {selectedDistrict && (
        <div className="mt-4 p-3 bg-pink-50 rounded-md border border-pink-100">
          <h4 className="font-medium text-pink-800">{selectedDistrict.district_name} Stats:</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <span className="text-gray-600">Expenditure: </span>
              <span className="font-medium">₹{formatNumber(selectedDistrict.total_expenditure / 10000000)} Cr</span>
            </div>
            <div>
              <span className="text-gray-600">Person Days: </span>
              <span className="font-medium">{formatNumber(selectedDistrict.person_days_generated)}</span>
            </div>
            <div>
              <span className="text-gray-600">Avg. Wage: </span>
              <span className="font-medium">₹{(selectedDistrict.avg_wage_paid || 0).toFixed(2)}/day</span>
            </div>
            <div>
              <span className="text-gray-600">Rank: </span>
              <span className="font-medium">
                #{sortedData.findIndex(d => d.district_code === selectedDistrict.district_code) + 1}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
