import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './CompoundInterestCalculator.css';
import Select from 'react-select';

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [contributionFrequency, setContributionFrequency] = useState('monthly');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [result, setResult] = useState('');
  const [chartData, setChartData] = useState(null);

  const calculateInterest = () => {
    const compoundFrequency = getCompoundFrequency(contributionFrequency);
    const totalPeriods = time * compoundFrequency;
    const interestRatePerPeriod = rate / 100 / compoundFrequency;

    let amount = principal;
    let totalContributed = principal;
    let totalInterest = 0;

    for (let i = 0; i < totalPeriods; i++) {
      amount = amount * (1 + interestRatePerPeriod) + monthlyContribution;
      totalContributed += monthlyContribution;
      totalInterest = amount - totalContributed;
    }

    // Generate the data for the chart
    const chartData = {
      labels: Array.from({ length: time }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Compound Interest',
          data: Array.from({ length: time }, (_, i) =>
            (principal * Math.pow(1 + interestRatePerPeriod, i + 1)).toFixed(2)
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
    setResult({
      savings: '$' + amount.toFixed(1),
      contributed: '$' + totalContributed.toFixed(1),
      interest: '$' + totalInterest.toFixed(1),
    });
  };

  const getCompoundFrequency = (frequency) => {
    switch (frequency) {
      case 'monthly':
        return 12;
      case 'quarterly':
        return 4;
      case 'annually':
        return 1;
      default:
        return 1;
    }
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
        <div className="form-group">
          <label>How often will you contribute?</label>
          <Select
            options={[
              { value: 'monthly', label: 'Once per month' },
              { value: 'quarterly', label: 'Once per quarter' },
              { value: 'annually', label: 'Once per year' },
            ]}
            onChange={(selectedOption) =>
              setContributionFrequency(selectedOption.value)
            }
          />
        </div>
        <div className="form-group">
          <label>How often will your interest compound?</label>
          <Select
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'annually', label: 'Annually' },
            ]}
            onChange={(selectedOption) => console.log(selectedOption)}
          />
        </div>
        <div className="form-group">
          <label>Monthly Contribution:</label>
          <input
            type="number"
            placeholder="Monthly Contribution"
            value={monthlyContribution}
            onChange={(e) =>
              setMonthlyContribution(parseFloat(e.target.value))
            }
          />
        </div>
        <div className="button-container">
          <button className="calculate-button" onClick={calculateInterest}>
            Calculate
          </button>
        </div>
        {result && (
          <div className="result-container">
            <p className="result">Your estimated savings: {result.savings}</p>
            <p className="result">
              Total amount contributed: {result.contributed}
            </p>
            <p className="result">Total interest: {result.interest}</p>
          </div>
        )}
      </div>
      <div className="chart-container">
        {chartData && (
          <Line
            data={chartData}
            options={{
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Years',
                    color: '#333',
                    font: {
                      size: 12,
                    },
                  },
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Amount',
                    color: '#333',
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CompoundInterestCalculator;
