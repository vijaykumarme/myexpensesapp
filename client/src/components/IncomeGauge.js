import React from 'react';
import GaugeChart from 'react-gauge-chart';

const IncomeGauge = ({ income }) => {
  const thresholds = [5000, 10000, 20000];
  const maxThreshold = thresholds[2];
  const colors = ['#007bff', '#ffc107', '#28a745']; // Blue, Yellow, Green
  const percentage = Math.min(income / maxThreshold, 1);
  const displayText = `₹${income}`;

  return (
    <div style={{ position: 'relative', width: '80%', margin: '0 auto' }}>
      {/* Custom Gauge Chart */}
      <GaugeChart
        id="income-gauge-chart"
        nrOfLevels={20}
        arcsLength={[
          thresholds[0] / maxThreshold,
          (thresholds[1] - thresholds[0]) / maxThreshold,
          (maxThreshold - thresholds[1]) / maxThreshold,
        ]}
        colors={colors}
        percent={percentage}
        arcWidth={0.3}
        textColor="#000000"
        needleColor="#000000"
        needleBaseColor="#000000"
        formatTextValue={() => ''} // Hide default label
        arcPadding={0.02}
        cornerRadius={3}
      />

      {/* Custom Value Text */}
      <div>{displayText}</div>

      {/* Custom Tick Labels */}
      <div>
        <span>0</span>
        <span style={{ position: 'absolute', left: `${(thresholds[0] / maxThreshold) * 100}%`, transform: 'translateX(-50%)' }}>{thresholds[0]}</span>
        <span style={{ position: 'absolute', left: `${(thresholds[1] / maxThreshold) * 100}%`, transform: 'translateX(-50%)' }}>{thresholds[1]}</span>
        <span style={{ position: 'absolute', right: '0' }}>{maxThreshold}</span>
      </div>
    </div>
  );
};

export default IncomeGauge;