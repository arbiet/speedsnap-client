import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const GaugeChart = ({ label, unit, data }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const gradientSegment = ctx.createLinearGradient(0, 0, 300, 0);
        gradientSegment.addColorStop(0, 'red');
        gradientSegment.addColorStop(0.7, 'yellow');
        gradientSegment.addColorStop(1, 'green');

        const chartData = {
            labels: ['Score', 'Gray Area'],
            datasets: [{
                label: label,
                // data: [0, 30], // Start with 0
                // backgroundColor: [gradientSegment, 'rgba(0, 0, 0, 0.2)'],
                data: data > 30 ? [data, 0] : [data, 30 - data],
                backgroundColor: data > 30 ? [gradientSegment, 'rgba(0, 0, 0, 0)'] : [gradientSegment, 'rgba(0, 0, 0, 0.2)'],
                borderColor: [gradientSegment, 'rgba(0, 0, 0, 0.2)'],
                borderWidth: 1,
                cutout: '90%',
                circumference: 180,
                rotation: 270
            }]
        };

        const gaugeChartText = {
            id: 'gaugeChartText',
            afterDatasetsDraw(chart, args, pluginOptions) {
                const { ctx, data, chartArea: { left, right } } = chart;
                ctx.save();
                const xCoor = chart.getDatasetMeta(0).data[0].x;
                const yCoor = chart.getDatasetMeta(0).data[0].y;
                const score = Math.round(data.datasets[0].data[0]);
                let rating;

                if (score < 10) {
                    rating = 'Bad';
                } else if (score >= 10 && score < 30) {
                    rating = 'Fair';
                } else if (score >= 30 && score <= 50) {
                    rating = 'Good';
                } else if (score > 50) {
                    rating = 'Very Good';
                }

                function textLabel(text, x, y, fontSize, textBaseline, textAlign) {
                    ctx.font = `${fontSize}px sans-serif`;
                    ctx.fillStyle = '#666';
                    ctx.textBaseline = textBaseline;
                    ctx.textAlign = textAlign;
                    ctx.fillText(text, x, y);
                }

                textLabel(`0 ${unit}`, left, yCoor + 20, 15, 'top', 'left');
                textLabel(`30 ${unit}`, right, yCoor + 20, 15, 'top', 'right');
                textLabel(`${score} Mbps`, xCoor, yCoor, 80, 'bottom', 'center');
                textLabel(rating, xCoor, yCoor - 100, 30, 'bottom', 'center');
            }
        };

        chartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                aspectRatio: 1.5,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [gaugeChartText]
        });

        // Animate data update
        let animationStep = 0;
        const duration = 5000; // 5 seconds
        const steps = 100;
        const interval = duration / steps;

        const animateDataUpdate = () => {
            if (animationStep < steps) {
                const progress = animationStep / steps;
                const updatedData = data * progress;
                chartInstanceRef.current.data.datasets[0].data[0] = updatedData;
                chartInstanceRef.current.update();
                animationStep++;
                setTimeout(animateDataUpdate, interval);
            }
        };

        animateDataUpdate();

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, label, unit]);

    return <canvas ref={chartRef}></canvas>;
};

export default GaugeChart;
