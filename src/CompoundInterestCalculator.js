import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import './CompoundInterestCalculator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import logoImage from './logo.jpg';

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    const calculatorTitle = document.querySelector('.calculator-title');
    if (calculatorTitle) {
      calculatorTitle.classList.add('animate__animated', 'animate__fadeInUp');
    }
  }, []);

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const formatNumber = (value) => {
    if (typeof value !== 'string') {
      return '';
    }

    const cleanValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = cleanValue.split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let formattedValue = formattedIntegerPart;
    if (decimalPart) {
      formattedValue += `.${decimalPart}`;
    }
    return formattedValue;
  };

  const calculateInterest = useCallback(() => {
    const totalPeriods = parseFloat(time);
    const interestRatePerPeriod = parseFloat(rate) / 100;

    let amount = parseFloat(principal);
    let totalContributed = parseFloat(principal);
    let totalInterest = 0;

    const contributionPerPeriod = parseFloat(monthlyContribution);
    const contributionPeriods = 12;

    for (let i = 0; i < totalPeriods; i++) {
      if ((i + 1) % contributionPeriods === 0) {
        amount += contributionPerPeriod;
        totalContributed += contributionPerPeriod;
      }

      amount = (amount + contributionPerPeriod) * (1 + interestRatePerPeriod);
      totalInterest = amount - totalContributed;
    }

    const chartData = {
      labels: Array.from({ length: parseFloat(time) }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Compound Interest',
          data: Array.from({ length: parseFloat(time) }, (_, i) => {
            const balance =
              parseFloat(principal) +
              contributionPerPeriod *
                contributionPeriods *
                ((Math.pow(1 + interestRatePerPeriod, i + 1) - 1) / interestRatePerPeriod);
            return parseFloat(balance.toFixed(2));
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    setChartData(chartData);

    setResult({
      savings: '$' + formatNumber(chartData.datasets[0].data[parseFloat(time) - 1]),
      contributed: '$' + formatNumber(totalContributed),
      interest: '$' + formatNumber(totalInterest.toFixed(2)),
    });
  }, [principal, rate, time, monthlyContribution]);

  useEffect(() => {
    calculateInterest();
  }, [calculateInterest]);

  return (
    <div className={`compound-interest-calculator ${themeMode === 'dark' ? 'dark-mode' : ''}`}>
      <div className="input-container">
        <h2 className="calculator-title">Compound Interest Calculator</h2>
        <div className="form-group">
          <label>Principal Amount:</label>
          <input
            type="text"
            placeholder="Principal Amount"
            value={principal}
            onChange={(e) => setPrincipal(formatNumber(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Interest Rate (%):</label>
          <input
            type="text"
            placeholder="Interest Rate"
            value={rate}
            onChange={(e) => setRate(formatNumber(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Time (in years):</label>
          <input
            type="text"
            placeholder="Time (in years)"
            value={time}
            onChange={(e) => setTime(formatNumber(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Monthly Contribution:</label>
          <input
            type="text"
            placeholder="Monthly Contribution"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(formatNumber(e.target.value))}
          />
        </div>
        <div className="button-container">
          <button className="calculate-button" onClick={calculateInterest}>
            Calculate
          </button>
        </div>
      </div>

      <div className="chart-container">
        {result && (
          <div className="result-container">
            <p className="result">Your estimated savings: {result.savings}</p>
            <p className="result">Total amount contributed: {result.contributed}</p>
            <p className="result">Total interest: {result.interest}</p>
          </div>
        )}
        {chartData && (
          <React.Fragment>
            <Line
              data={chartData}
              options={{
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Balance per Year',
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
                      text: 'Total Amount',
                      color: '#333',
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                    intersect: false,
                    mode: 'nearest',
                  },
                },
              }}
            />
          </React.Fragment>
        )}
      </div>
      <div className="logo-container">
        <img src={logoImage} alt="Logo" className="logo-image" />
      </div>

      <button className={`theme-toggle-button ${themeMode === 'light' ? 'light-mode' : 'dark-mode'}`} onClick={toggleThemeMode}>
        {themeMode === 'light' ? (
          <FontAwesomeIcon icon={faSun} />
        ) : (
          <FontAwesomeIcon icon={faMoon} />
        )}
      </button>
    </div>
  );
}

export default CompoundInterestCalculator;
