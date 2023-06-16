import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './CompoundInterestCalculator.css';

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState('');
  const [chartData, setChartData] = useState(null);

  const calculateInterest = () => {
    const amount = principal * Math.pow(1 + rate / 100, time);

    // Generate the data for the chart
    const chartData = {
      labels: Array.from({ length: time }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Compound Interest',
          data: Array.from({ length: time }, (_, i) =>
            (principal * Math.pow(1 + rate / 100, i + 1)).toFixed(2)
          ),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Update the chartData state
    setChartData(chartData);

    // Update the result state
    setResult(amount.toFixed(2));
  };

  return (
    <div className="compound-interest-calculator">
      <div className="input-container">
        <h2 className="calculator-heading">Compound Interest Calculator</h2>
        <div className="form-group">
          <label>Principal Amount:</label>
          <input
            type="number"
            placeholder="Principal Amount"
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Interest Rate (%):</label>
          <input
            type="number"
            placeholder="Interest Rate"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Time (in years):</label>
          <input
            type="number"
            placeholder="Time (in years)"
            value={time}
            onChange={(e) => setTime(parseFloat(e.target.value))}
          />
        </div>
        <div className="button-container">
          <button className="calculate-button" onClick={calculateInterest}>
            Calculate
          </button>
        </div>
        {result && <p className="result">Result: {result}</p>}
      </div>
      <div className="chart-container">
        {chartData && <Line data={chartData} />}
      </div>
    </div>
  );
}

export default CompoundInterestCalculator;
