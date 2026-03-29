/**
 * SentimentChart Component
 *
 * KEY CONCEPTS:
 * - Recharts: React charting library
 * - PieChart: Visual representation of sentiment distribution
 * - Generic components: Type-safe chart data
 */

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ChartDataPoint } from '@/types';

// Chart colors
const COLORS = {
  positive: '#22c55e', // green-500
  negative: '#ef4444', // red-500
};

/**
 * Props for SentimentChart component
 * KEY CONCEPTS: Interface defining component props
 */
interface SentimentChartProps {
  positiveCount: number;
  negativeCount: number;
}

/**
 * SentimentChart displays sentiment distribution as a pie chart
 *
 * KEY CONCEPTS:
 * - Client component: Uses hooks and browser APIs
 * - Responsive container: Adapts to parent size
 * - Pie chart with cells: Custom colors for each segment
 */
export function SentimentChart({
  positiveCount,
  negativeCount,
}: SentimentChartProps) {
  // Prepare chart data
  // KEY CONCEPT: Transforming raw counts into chart-friendly format
  const data: ChartDataPoint[] = [
    { name: 'Positive', value: positiveCount },
    { name: 'Negative', value: negativeCount },
  ].filter((item) => item.value > 0); // Hide zero segments

  // No data state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[120px] sm:h-[180px] text-muted-foreground text-sm">
        No analysis data yet
      </div>
    );
  }

  return (
    <div className="h-[120px] sm:h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Pie chart with custom colors */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            paddingAngle={2}
            dataKey="value"
          >
            {/* KEY CONCEPT: Mapping data to colors */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name === 'Positive'
                    ? COLORS.positive
                    : COLORS.negative
                }
              />
            ))}
          </Pie>

          {/* Tooltip on hover */}
          <Tooltip
            formatter={(value: number) => [`${value} analyses`, 'Count']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />

          {/* Legend below chart */}
          <Legend
            verticalAlign="bottom"
            height={24}
            iconSize={10}
            formatter={(value) => (
              <span className="text-xs sm:text-sm text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
