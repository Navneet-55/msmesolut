"""
Data analysis and processing service
"""

from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta


class DataAnalyzer:
    """Data analysis and processing service"""

    def analyze_time_series(
        self,
        data: List[Dict[str, Any]],
        date_field: str = 'date',
        value_field: str = 'value'
    ) -> Dict[str, Any]:
        """
        Analyze time series data

        Args:
            data: List of dictionaries with date and value fields
            date_field: Name of date field
            value_field: Name of value field

        Returns:
            Dictionary with analysis results
        """
        df = pd.DataFrame(data)
        df[date_field] = pd.to_datetime(df[date_field])
        df = df.sort_values(date_field)

        values = df[value_field].values

        analysis = {
            'total_records': len(df),
            'date_range': {
                'start': df[date_field].min().isoformat(),
                'end': df[date_field].max().isoformat()
            },
            'statistics': {
                'mean': float(np.mean(values)),
                'median': float(np.median(values)),
                'std': float(np.std(values)),
                'min': float(np.min(values)),
                'max': float(np.max(values)),
            },
            'trend': self._calculate_trend(values),
            'seasonality': self._detect_seasonality(df, date_field, value_field)
        }

        return analysis

    def _calculate_trend(self, values: np.ndarray) -> str:
        """Calculate trend direction"""
        if len(values) < 2:
            return 'insufficient_data'

        # Simple linear trend
        x = np.arange(len(values))
        slope = np.polyfit(x, values, 1)[0]

        if slope > 0.1:
            return 'increasing'
        elif slope < -0.1:
            return 'decreasing'
        else:
            return 'stable'

    def _detect_seasonality(
        self,
        df: pd.DataFrame,
        date_field: str,
        value_field: str
    ) -> Optional[Dict[str, Any]]:
        """Detect seasonality patterns"""
        if len(df) < 30:  # Need at least 30 data points
            return None

        df['month'] = df[date_field].dt.month
        df['day_of_week'] = df[date_field].dt.dayofweek

        monthly_avg = df.groupby('month')[value_field].mean()
        weekly_avg = df.groupby('day_of_week')[value_field].mean()

        return {
            'monthly_variation': float(monthly_avg.std() / monthly_avg.mean()) if monthly_avg.mean() > 0 else 0,
            'weekly_variation': float(weekly_avg.std() / weekly_avg.mean()) if weekly_avg.mean() > 0 else 0,
            'has_seasonality': monthly_avg.std() / monthly_avg.mean() > 0.1 if monthly_avg.mean() > 0 else False
        }

    def detect_anomalies(
        self,
        values: List[float],
        method: str = 'iqr'
    ) -> List[Dict[str, Any]]:
        """
        Detect anomalies in data

        Args:
            values: List of numeric values
            method: Detection method ('iqr' or 'zscore')

        Returns:
            List of detected anomalies
        """
        values_array = np.array(values)
        anomalies = []

        if method == 'iqr':
            Q1 = np.percentile(values_array, 25)
            Q3 = np.percentile(values_array, 75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR

            for idx, value in enumerate(values):
                if value < lower_bound or value > upper_bound:
                    anomalies.append({
                        'index': idx,
                        'value': float(value),
                        'type': 'outlier',
                        'severity': 'high' if abs(value - np.median(values_array)) > 2 * IQR else 'medium'
                    })

        elif method == 'zscore':
            mean = np.mean(values_array)
            std = np.std(values_array)

            if std > 0:
                z_scores = np.abs((values_array - mean) / std)

                for idx, z_score in enumerate(z_scores):
                    if z_score > 3:
                        anomalies.append({
                            'index': idx,
                            'value': float(values[idx]),
                            'z_score': float(z_score),
                            'type': 'outlier',
                            'severity': 'high' if z_score > 4 else 'medium'
                        })

        return anomalies

    def forecast(
        self,
        values: List[float],
        periods: int = 7,
        method: str = 'moving_average'
    ) -> List[float]:
        """
        Simple forecasting

        Args:
            values: Historical values
            periods: Number of periods to forecast
            method: Forecasting method

        Returns:
            List of forecasted values
        """
        if method == 'moving_average':
            window = min(7, len(values))
            if window == 0:
                return [0.0] * periods

            last_values = values[-window:]
            avg = np.mean(last_values)

            # Simple trend
            if len(values) >= 2:
                trend = (values[-1] - values[-window]) / window
            else:
                trend = 0

            forecast = []
            for i in range(periods):
                forecast.append(float(avg + trend * (i + 1)))

            return forecast

        return [float(np.mean(values))] * periods if values else [0.0] * periods

