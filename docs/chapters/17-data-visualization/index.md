---
title: Data Visualization and Process Control
description: Production-quality charts and dashboards for hydroponic data — Matplotlib, Plotly, real-time Dash dashboards, Statistical Process Control charts, and anomaly detection for automated grow monitoring.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# Data Visualization and Process Control

## Summary

This chapter builds on the analysis foundation to teach production-quality data visualization and automated process monitoring: Matplotlib for static charts (line, scatter, histogram, subplots), Plotly and Plotly Express for interactive charts, Plotly Dash for real-time dashboards fed by live sensor streams, and statistical process control (SPC) with X-bar and R control charts, control limit calculation, and anomaly detection methods including Z-score, IQR outlier detection, and moving average anomaly flagging.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. scikit-learn Linear Regression
2. Matplotlib Basics
3. Line Charts for Sensor Data
4. Scatter Plots
5. Histogram and Distribution
6. Subplots and Figure Layout
7. Plotly Introduction
8. Plotly Express Line Chart
9. Plotly Interactive Dashboard
10. Dash Framework (Plotly Dash)
11. Real-Time Dashboard Updates
12. Time-Series Visualization
13. Statistical Process Control
14. Control Charts (X-bar R-chart)
15. Control Limits Calculation
16. Anomaly Detection Methods
17. Z-Score Anomaly Detection
18. IQR Outlier Detection
19. Moving Average Anomaly Detection
20. Trend Detection in Sensor Data

## Prerequisites

This chapter builds on concepts from:

- [Chapter 16: Data Collection and Analysis](../16-data-collection-analysis/index.md)

---

!!! mascot-welcome "Cress paints the data picture"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 17, growers! Chapter 16 gave you the analysis tools. Now let's make the data visible. A well-designed chart reveals patterns that no table of numbers can — the pH spike at day 14, the EC decay curve over three weeks, the daily CO₂ rhythm that proves your plants are photosynthesizing. This chapter teaches you to build everything from quick exploratory plots to live dashboards that update as your sensors log data. Let's grow some charts!

## scikit-learn: Machine Learning's Linear Regression

Before we dive into visualization, let's complete the regression story from Chapter 16. **scikit-learn** is Python's most widely used machine learning library. While `numpy.polyfit()` performs simple polynomial regression, scikit-learn's `LinearRegression` model integrates cleanly into larger machine learning workflows and provides additional diagnostics like R² (coefficient of determination).

Before we use it, key terms: **R²** (R-squared) is the proportion of variance in the dependent variable (pH) explained by the independent variable (time). R² = 1.0 means the linear model fits perfectly; R² = 0 means no linear relationship. For a drifting pH trend, we expect moderate R² (0.3–0.7 depending on noise level).

```python
from sklearn.linear_model import LinearRegression
import numpy as np

# Prepare data
days = np.arange(len(daily_ph)).reshape(-1, 1)   # Must be 2D for sklearn
ph_values = daily_ph.values

# Fit model
model = LinearRegression()
model.fit(days, ph_values)

slope = model.coef_[0]
intercept = model.intercept_
r_squared = model.score(days, ph_values)

print(f"pH trend: {slope:+.4f} units/day (R²={r_squared:.3f})")
```

scikit-learn will be revisited in Chapter 20 for crop yield prediction models.

## Matplotlib: Static Charts for Analysis

**Matplotlib** is the foundational plotting library for Python. It produces publication-quality static charts suitable for reports, papers, and slide decks. Every other Python visualization library (Plotly, Seaborn, pandas plots) builds on or alongside Matplotlib.

Before looking at specific chart types, two structural concepts: a **Figure** is the top-level container (the entire image); an **Axes** (not "axis") is a single plot area within the figure. A figure can contain multiple Axes arranged in subplots.

### Line Charts for Sensor Data

A **line chart** connects data points in sequence, making it ideal for time-series sensor data where the order (time) is meaningful:

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

fig, ax = plt.subplots(figsize=(12, 4))

ax.plot(df.index, df["ph"], color="steelblue", linewidth=1, label="pH")
ax.axhline(y=6.0, color="red", linestyle="--", alpha=0.5, label="Lower limit (6.0)")
ax.axhline(y=7.0, color="red", linestyle="--", alpha=0.5, label="Upper limit (7.0)")
ax.fill_between(df.index, 6.0, 7.0, alpha=0.1, color="green", label="Target zone")

ax.set_ylabel("pH")
ax.set_xlabel("Date")
ax.set_title("Reservoir pH — 35-Day Lettuce Cycle")
ax.legend()
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %d"))
ax.xaxis.set_major_locator(mdates.DayLocator(interval=5))

plt.tight_layout()
plt.savefig("ph_cycle.png", dpi=150)
plt.show()
```

`ax.fill_between()` adds a shaded band for the target pH zone — a visual cue that the line leaving the band is an alarm condition.

### Scatter Plots

A **scatter plot** shows the relationship between two variables by placing a dot at each (x, y) coordinate. For hydroponic analysis, scatter plots reveal correlations between sensor variables:

```python
fig, ax = plt.subplots(figsize=(6, 6))

scatter = ax.scatter(df["temperature"], df["dissolved_oxygen"],
                     c=df["ph"], cmap="RdYlGn",   # Color by pH value
                     alpha=0.3, s=10)

plt.colorbar(scatter, label="pH")
ax.set_xlabel("Water Temperature (°C)")
ax.set_ylabel("Dissolved Oxygen (mg/L)")
ax.set_title("DO vs Temperature (colored by pH)")
plt.tight_layout()
plt.show()
```

Coloring scatter plot points by a third variable (pH, shown on a color scale) reveals three-way relationships in a single chart.

### Histogram and Distribution

A **histogram** shows the distribution of values — how often each measurement falls in each bin. For pH, a tight histogram centered on 6.5 means good control; a wide or bimodal histogram reveals instability.

```python
fig, ax = plt.subplots(figsize=(8, 4))

ax.hist(df["ph"].dropna(), bins=50, color="steelblue", edgecolor="white", alpha=0.8)
ax.axvline(x=6.0, color="red", linestyle="--", label="Lower limit")
ax.axvline(x=7.0, color="red", linestyle="--", label="Upper limit")
ax.axvline(x=df["ph"].mean(), color="orange", linestyle="-", linewidth=2,
           label=f"Mean: {df['ph'].mean():.2f}")

ax.set_xlabel("pH")
ax.set_ylabel("Frequency")
ax.set_title("pH Distribution — 35-Day Crop Cycle")
ax.legend()
plt.tight_layout()
plt.show()
```

### Subplots and Figure Layout

Multiple subplots on one figure allow comparing several sensors side by side at the same time scale:

```python
fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)

axes[0].plot(df.index, df["ph"], color="steelblue")
axes[0].set_ylabel("pH")
axes[0].set_ylim(4.0, 9.0)

axes[1].plot(df.index, df["ec"], color="green")
axes[1].set_ylabel("EC (mS/cm)")

axes[2].plot(df.index, df["temperature"], color="orange")
axes[2].set_ylabel("Temp (°C)")
axes[2].set_xlabel("Date")

plt.suptitle("35-Day Lettuce Cycle — All Sensors")
plt.tight_layout()
plt.show()
```

`sharex=True` links the x-axis of all subplots — zooming or panning one subplot moves all others simultaneously.

## Plotly: Interactive Visualization

**Plotly** is an interactive visualization library that produces charts with pan, zoom, hover tooltips, and downloadable images — ideal for exploratory analysis and web dashboards. Unlike Matplotlib (static PNG output), Plotly charts are rendered as HTML that runs in a browser.

### Plotly Express

**Plotly Express** is Plotly's high-level API — it creates common chart types in one line:

```python
import plotly.express as px

# Interactive line chart with hover tooltips
fig = px.line(df.reset_index(), x="datetime", y=["ph", "ec"],
              title="pH and EC — Crop Cycle",
              labels={"value": "Measurement", "datetime": "Date"},
              height=400)
fig.add_hline(y=6.0, line_dash="dash", line_color="red", annotation_text="pH min")
fig.add_hline(y=7.0, line_dash="dash", line_color="red", annotation_text="pH max")
fig.show()
```

### Plotly Interactive Dashboard

For presenting multiple charts together in an interactive HTML report, Plotly's `make_subplots()` creates a multi-panel figure with shared x-axes and synchronized zoom:

```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=3, cols=1, shared_xaxes=True,
                    subplot_titles=["pH", "EC (mS/cm)", "Temperature (°C)"])

fig.add_trace(go.Scatter(x=df.index, y=df["ph"], name="pH",
                          line=dict(color="steelblue")), row=1, col=1)
fig.add_trace(go.Scatter(x=df.index, y=df["ec"], name="EC",
                          line=dict(color="green")), row=2, col=1)
fig.add_trace(go.Scatter(x=df.index, y=df["temperature"], name="Temp",
                          line=dict(color="orange")), row=3, col=1)

fig.update_layout(height=800, title="35-Day Crop Cycle Dashboard")
fig.write_html("crop_dashboard.html")   # Save as interactive HTML file
fig.show()
```

## Dash: Real-Time Dashboards

**Plotly Dash** is a web application framework built on Plotly that allows you to create live dashboards that update automatically as new sensor data arrives. A Dash app is a Python script that runs a local web server; you open the dashboard in any browser at `http://localhost:8050`.

Before we look at the code, two key Dash concepts to understand: **components** are the UI elements (graphs, sliders, dropdowns) rendered in the browser, and **callbacks** are Python functions that automatically run when a component value changes — this is how real-time updates work.

```python
from dash import Dash, dcc, html, Input, Output
import plotly.graph_objects as go
import pandas as pd
import time

app = Dash(__name__)

app.layout = html.Div([
    html.H1("Hydroponic System Monitor"),
    dcc.Graph(id="live-chart"),
    dcc.Interval(id="interval", interval=30_000, n_intervals=0)  # Update every 30s
])

@app.callback(Output("live-chart", "figure"),
              Input("interval", "n_intervals"))
def update_chart(n):
    df = pd.read_csv("sensor_log.csv",
                     names=["timestamp", "temperature", "ph", "ec"])
    df["datetime"] = pd.to_datetime(df["timestamp"], unit="s")

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df["datetime"], y=df["ph"],
                              name="pH", line=dict(color="steelblue")))
    fig.update_layout(title=f"Live pH — {len(df)} readings",
                      xaxis_title="Time", yaxis_title="pH",
                      yaxis=dict(range=[4, 9]))
    return fig

if __name__ == "__main__":
    app.run_server(debug=True)
```

The `dcc.Interval` component fires the callback every 30 seconds, which re-reads the CSV file and redraws the chart. This is the simplest form of real-time update — the chart automatically shows the latest data as the microcontroller appends new rows.

!!! mascot-tip "Save the Dash dashboard HTML for offline sharing"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Cress points upward with one finger">
    Dash dashboards require Python running as a server. For sharing static analysis results with teammates or teachers who don't have Python, use `fig.write_html("dashboard.html")` to export any Plotly figure as a self-contained HTML file that runs in any browser without Python installed. Interactive zoom, hover, and pan all work in the exported file.

## Statistical Process Control

**Statistical Process Control (SPC)** is a set of methods from manufacturing quality management that use statistics to monitor and control a process — keeping it within desired parameters and detecting when it drifts out of control. For hydroponics, SPC transforms reactive monitoring ("I'll check when something looks wrong") into proactive control ("the system alerts me when a measured trend indicates a problem is developing").

### Control Charts: X-bar and R Charts

A **control chart** (also called a Shewhart chart) plots a measurement over time with three horizontal lines:

- **Center line (CL)**: The process mean (average of all measurements)
- **Upper Control Limit (UCL)**: Mean + 3 × standard deviation
- **Lower Control Limit (LCL)**: Mean − 3 × standard deviation

The principle: if a process is stable and normally distributed, 99.73% of measurements will fall between LCL and UCL. Points outside these limits signal a **statistically unusual event** — not just normal variation.

An **X-bar chart** tracks the process mean; an **R chart** (Range chart) tracks process variability.

### Control Limits Calculation

```python
import numpy as np
import matplotlib.pyplot as plt

ph_values = df["ph"].dropna().values

mean = np.mean(ph_values)
std = np.std(ph_values)

ucl = mean + 3 * std
lcl = mean - 3 * std
uwl = mean + 2 * std   # Upper Warning Limit (2-sigma)
lwl = mean - 2 * std   # Lower Warning Limit (2-sigma)

print(f"pH Control Chart: mean={mean:.3f}, UCL={ucl:.3f}, LCL={lcl:.3f}")

# Flag out-of-control points
out_of_control = (ph_values > ucl) | (ph_values < lcl)
print(f"Out-of-control events: {out_of_control.sum()}")
```

Plotting the control chart:

```python
fig, ax = plt.subplots(figsize=(14, 4))

ax.plot(df.index, ph_values, color="steelblue", linewidth=0.8, alpha=0.7)
ax.axhline(mean, color="green", linewidth=1.5, label=f"Mean: {mean:.2f}")
ax.axhline(ucl, color="red", linewidth=1, linestyle="--", label=f"UCL: {ucl:.2f}")
ax.axhline(lcl, color="red", linewidth=1, linestyle="--", label=f"LCL: {lcl:.2f}")
ax.axhline(uwl, color="orange", linewidth=0.8, linestyle=":", label="2σ")
ax.axhline(lwl, color="orange", linewidth=0.8, linestyle=":")

# Mark out-of-control points in red
oc_mask = (df["ph"] > ucl) | (df["ph"] < lcl)
ax.scatter(df.index[oc_mask], df["ph"][oc_mask], color="red", zorder=5,
           label="Out of control")

ax.set_ylabel("pH")
ax.set_title("pH Control Chart (X-bar)")
ax.legend(loc="upper right")
plt.tight_layout()
plt.show()
```

## Anomaly Detection Methods

Anomaly detection automatically identifies unusual readings that may indicate sensor failure, system problems, or crop stress. Three methods are commonly used for hydroponic sensor data.

### Z-Score Anomaly Detection

A **Z-score** measures how many standard deviations a value is from the mean. Values with |Z| > 3 are statistical outliers (occurring less than 0.3% of the time in a normal distribution).

Before the code, the formula: given a measurement \( x \), mean \( \mu \), and standard deviation \( \sigma \), the Z-score is \( Z = (x - \mu) / \sigma \).

```python
def detect_zscore_anomalies(series, threshold=3.0):
    mean = series.mean()
    std = series.std()
    z_scores = np.abs((series - mean) / std)
    anomalies = series[z_scores > threshold]
    return anomalies

ph_anomalies = detect_zscore_anomalies(df["ph"])
print(f"Z-score anomalies (|Z|>3): {len(ph_anomalies)}")
```

Z-score anomaly detection works well for symmetric, roughly normal distributions. It is sensitive to the overall dataset distribution — if you have many legitimate extreme values (during dosing events), the threshold may need adjustment.

### IQR Outlier Detection

The **Interquartile Range (IQR)** method detects outliers without assuming a normal distribution. The IQR is the range between the 25th and 75th percentiles. Values more than 1.5 × IQR below the 25th percentile or above the 75th percentile are considered outliers.

```python
def detect_iqr_outliers(series):
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower_fence = Q1 - 1.5 * IQR
    upper_fence = Q3 + 1.5 * IQR
    outliers = series[(series < lower_fence) | (series > upper_fence)]
    return outliers, lower_fence, upper_fence

ec_outliers, lo, hi = detect_iqr_outliers(df["ec"])
print(f"EC IQR bounds: [{lo:.3f}, {hi:.3f}], outliers: {len(ec_outliers)}")
```

IQR detection is robust to skewed distributions and is commonly used for EC data, which can have asymmetric distributions during dosing events.

### Moving Average Anomaly Detection

**Moving average anomaly detection** flags points where the current reading deviates from the recent moving average by more than a threshold. This is the most practical method for real-time automated alarms in hydroponic control systems:

```python
def flag_anomalies_by_ma(series, window=12, threshold_sigma=2.5):
    rolling_mean = series.rolling(window=window).mean()
    rolling_std = series.rolling(window=window).std()
    upper = rolling_mean + threshold_sigma * rolling_std
    lower = rolling_mean - threshold_sigma * rolling_std
    anomaly_mask = (series > upper) | (series < lower)
    return anomaly_mask, rolling_mean, upper, lower

anomaly_mask, ma, upper, lower = flag_anomalies_by_ma(df["ph"])
print(f"Moving average anomalies: {anomaly_mask.sum()}")
```

In a production hydroponic controller, this logic runs on the desktop server (or a Raspberry Pi) that receives MQTT data from the Pico W, publishing an alert message to `farm/zone1/alarms/ph` whenever a moving-average anomaly is detected.

### Trend Detection in Sensor Data

Beyond point anomalies, **trend detection** identifies when a sensor is drifting in a consistent direction — a more insidious problem because individual readings look normal but the long-term direction is wrong.

A simple trend detector uses rolling linear regression: if the slope of a short window of recent readings exceeds a threshold, a trend alarm triggers.

```python
def detect_trend(series, window=24, slope_threshold=0.05):
    slopes = []
    for i in range(window, len(series)):
        segment = series.iloc[i-window:i]
        x = np.arange(window)
        slope = np.polyfit(x, segment.dropna().values, 1)[0]
        slopes.append(slope)
    return pd.Series(slopes, index=series.index[window:])

ph_slopes = detect_trend(df["ph"], window=24)   # 2-hour window (24 × 5-min readings)
trend_alarms = ph_slopes.abs() > 0.05   # Alert if pH drifts >0.05 pH/hour
```

A slope of +0.05 pH/hour means the solution is becoming 1.2 pH units more alkaline per day — a serious drift that requires immediate attention.

!!! mascot-thinking "Control charts vs. alarm setpoints"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress holds chin thoughtfully">
    A simple alarm setpoint ("alert if pH < 5.5") reacts to current values. A control chart alarm ("alert if pH is trending beyond UCL") reacts to statistical patterns. Control charts catch problems earlier — you'll get the trend alarm when pH is still at 6.2 and drifting, before it reaches 5.5 and the plants are already stressed. Use setpoint alarms as a safety net; use control charts for proactive management.

#### Diagram: SPC Dashboard for Hydroponics
<iframe src="../../sims/spc-dashboard/main.html" width="100%" height="722" scrolling="no"></iframe>
<details markdown="1">
<summary>Statistical Process Control Dashboard for Hydroponics</summary>
Type: interactive-dashboard
**sim-id:** spc-dashboard<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Demonstrate a complete SPC dashboard for a 35-day hydroponic crop cycle, allowing students to interactively explore control charts, anomaly detection, and trend analysis for pH, EC, and temperature.

Bloom Level: Analyze (L4) and Evaluate (L5)
Bloom Verb: Evaluate — students assess the system's performance by interpreting control chart patterns, anomaly flags, and trend slopes.

Layout: Canvas 900×540. Three sections:

Top section: Sensor selector tabs (pH | EC | Temperature) + time range slider (1 day to 35 days).

Middle section: Main control chart (60% of height)
- Line plot of selected sensor over selected time range
- Center line (green), UCL/LCL (red dashed), UWL/LWL (orange dotted)
- Rolling mean overlay (blue, thick)
- Out-of-control points shown as red circles
- Trend anomaly periods shaded in light red

Bottom section: three panels side by side:
- Stats panel: mean, std, UCL, LCL, % in-control, trend slope
- Anomaly table: timestamp, value, z-score, anomaly type (Z-score / IQR / Trend)
- Distribution histogram with CL and control limit lines overlaid

Interactivity:
- Clicking a point on the chart highlights it in the anomaly table
- Clicking a table row highlights the point on the chart
- Toggle "Show All Methods": adds IQR fences and moving-average bands to the chart
- Toggle "Simulate Dosing Event": injects a simulated pH spike at day 18 and shows how the anomaly detection methods respond differently

Responsive: Scales to container; on narrow screens, anomaly table moves below the chart.
</details>

## Key Takeaways

- **scikit-learn's LinearRegression** provides R² alongside slope and intercept — a more complete regression diagnostic than `numpy.polyfit()` alone.
- **Matplotlib** produces publication-quality static charts; the Figure/Axes architecture separates the container from the plot area; `plt.savefig()` exports to PNG or PDF.
- **Line charts** are ideal for sensor time-series; use `ax.fill_between()` for target zone bands and `ax.axhline()` for limit reference lines.
- **Scatter plots** reveal correlations between sensor variables; a third variable can be encoded as point color for three-way analysis.
- **Histograms** show the distribution of measurements — tight and centered means good process control; wide or bimodal means instability.
- **Subplots** with `sharex=True` display multiple sensors at the same time scale for synchronized inspection.
- **Plotly** produces interactive charts (zoom, pan, hover); `fig.write_html()` exports self-contained interactive HTML files.
- **Plotly Dash** creates live web dashboards with `dcc.Interval` triggering callbacks to reload data and redraw charts at a specified interval.
- **Statistical Process Control** uses UCL/LCL (mean ± 3σ) to distinguish normal variation from statistically unusual events — catches problems earlier than fixed setpoint alarms.
- **Anomaly detection methods** — Z-score (distance from mean), IQR (fence-based), and moving average (deviation from recent trend) — complement each other; use all three in a production monitoring system.

!!! mascot-celebration "Chapter 17 complete — you can see the whole story!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You've built a complete visualization and monitoring stack — from raw CSV logs to live dashboards and automated anomaly alarms. Chapter 18 shifts from the digital to the practical: food safety, pathogen prevention, HACCP planning, and integrated pest management for edible crops grown in recirculating systems. The most important question about hydroponic produce isn't "how did it grow?" — it's "is it safe to eat?" Let's find out!

[See Annotated References](./references.md)
