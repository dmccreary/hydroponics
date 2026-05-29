---
title: Data Collection and Analysis
description: From sensor logs to insight — CSV logging strategies, pandas DataFrames, time-series resampling, missing data handling, NumPy statistics, correlation, and linear regression for hydroponic crop analysis.
generated_by: claude skill chapter-content-generator
date: 2026-05-29 00:00:00
version: 0.08
---

# Data Collection and Analysis

## Summary

This chapter teaches the data science pipeline from sensor to insight: designing a logging strategy, writing CSV data to SD cards and cloud services (Google Sheets), setting up a Python environment with Jupyter notebooks, and working with pandas DataFrames for time-series resampling, rolling window statistics, and missing data handling. The chapter closes with NumPy arrays, statistical functions, correlation analysis, and linear regression — building the analytical vocabulary students need before the visualization chapter.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Data Collection Strategy
2. Sensor Reading Frequency
3. CSV File Format and Structure
4. Data Logging to SD Card
5. Cloud Data Storage Options
6. Google Sheets as Data Logger
7. Python Environment Setup
8. Jupyter Notebook Basics
9. pandas Library Introduction
10. DataFrame Creation and Structure
11. Reading CSV With pandas
12. DataFrame Indexing and Slicing
13. Date-Time Parsing With pandas
14. Resampling Time-Series Data
15. Rolling Window Statistics
16. Missing Data Handling
17. Data Cleaning and Validation
18. NumPy Library Introduction
19. NumPy Arrays
20. Array Operations Broadcasting
21. Statistical Functions in NumPy
22. Mean Median Standard Deviation
23. Correlation Analysis
24. Linear Regression
25. Regression in NumPy (polyfit)

## Prerequisites

This chapter builds on concepts from:

- [Chapter 13: Hardware Interfaces and Sensor Programming](../13-hardware-interfaces/index.md)
- [Chapter 15: Sensors and Electronics Hardware](../15-sensors-electronics/index.md)

---

!!! mascot-welcome "Cress opens the data notebook"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waves hello at chapter opening">
    Welcome to Chapter 16, growers! Your sensors are reading, your data is logging — now let's make it useful. This chapter moves from the microcontroller to your laptop: we'll organize weeks of pH, EC, and temperature readings into pandas DataFrames, clean up the gaps, calculate rolling averages and correlations, and fit a regression line to understand trends across a crop cycle. By the end, you'll be able to answer the question every grower wants to ask: "What did my system actually do for the last 30 days?" Let's grow some insight!

## Data Collection Strategy

Before writing a single line of analysis code, good data collection requires decisions about *what* to measure, *how often*, and *where to store it*. A thoughtful collection strategy produces clean, analyzable data; a poorly designed strategy produces CSV files full of gaps, inconsistent units, and timestamps that don't align across sensors.

Key decisions in a data collection strategy:

**What to measure**: At minimum, log pH, EC (or TDS), water temperature, and a timestamp. For comprehensive monitoring also log: air temperature, relative humidity, CO₂ ppm, reservoir level (cm), and the state of each actuator (pump on/off, lights on/off).

**Sensor reading frequency**: How often to sample each sensor depends on how quickly it changes and how much storage you have.

| Sensor | Typical Range | Recommended Interval | Reason |
|--------|--------------|---------------------|--------|
| Water temperature | Slow drift | Every 15 minutes | Slow changes |
| pH | Moderate drift | Every 5 minutes | Dosing events cause fast shifts |
| EC | Slow drift | Every 15 minutes | Changes over hours |
| Air temperature | Moderate | Every 5 minutes | Tracks day/night cycle |
| CO₂ | Fast variation | Every 1 minute | Responds quickly to ventilation |
| Pump/relay state | Event-driven | On each change | Log transitions, not continuous state |

**Data volume estimate**: A 6-column CSV row at 5-minute intervals generates approximately 864 rows per day. At ~50 bytes per row, that is 43 KB/day, or 1.5 MB per 35-day lettuce crop cycle — well within the capacity of even a modest SD card or cloud storage plan.

### Data Logging to SD Card

For long deployments where Wi-Fi is unavailable or unreliable, an SD card provides local persistent storage. The MicroPython `sdcard` driver and `uos` module allow mounting an SD card as a filesystem:

```python
import machine, uos, sdcard

spi = machine.SPI(1, sck=machine.Pin(10), mosi=machine.Pin(11), miso=machine.Pin(12))
sd = sdcard.SDCard(spi, machine.Pin(9))
uos.mount(sd, "/sd")

LOG_FILE = "/sd/hydro_log.csv"

def log_reading(timestamp, temp, ph, ec):
    with open(LOG_FILE, "a") as f:
        f.write(f"{timestamp},{temp:.1f},{ph:.2f},{ec:.3f}\n")
```

Write a CSV header once at the start of each crop cycle:

```python
with open(LOG_FILE, "w") as f:
    f.write("timestamp_unix,temperature_c,ph,ec_ms_cm\n")
```

### Cloud Data Storage: Google Sheets

For systems with reliable Wi-Fi, **Google Sheets** is a surprisingly capable cloud logging destination for small-scale hydroponic operations. The Sheets API accepts HTTP POST requests; the MicroPython `urequests` library (Chapter 14) can send readings from the Pico W directly to a sheet.

The workflow: create a Google Sheet → enable the Sheets API → generate an API key → use `urequests.post()` to append rows via the Sheets REST API. The spreadsheet then acts as a live database accessible from any browser, with built-in charting for quick visual inspection.

For more robust storage at scale, dedicated IoT time-series databases (InfluxDB, TimescaleDB) provide better query performance than spreadsheets, but Google Sheets is adequate for classroom and home-scale projects.

## Python Environment Setup

Data analysis in this chapter is done in Python on your laptop — not on the microcontroller. Before we analyze data, we need a working Python environment.

**Installation steps:**

1. Install Python 3.10+ from `python.org` or via Anaconda
2. Install required packages: `pip install pandas numpy matplotlib jupyter`
3. Launch Jupyter: `jupyter notebook` opens a browser-based notebook interface

Alternatively, **Google Colab** (colab.research.google.com) provides a free cloud Jupyter environment with all required packages pre-installed — no local installation needed.

## Jupyter Notebook Basics

A **Jupyter notebook** is an interactive document that mixes executable Python code blocks (cells) with Markdown text, equations, and output (tables, charts). Each code cell runs independently; variables from one cell are available in subsequent cells.

The workflow for hydroponic data analysis:

```python
# Cell 1: Imports
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Cell 2: Load data
df = pd.read_csv("hydro_log.csv")

# Cell 3: Inspect
df.head()       # Show first 5 rows
df.info()       # Column types and non-null counts
df.describe()   # Statistical summary
```

Running cells in order, inspecting output at each step, and modifying code based on what you see is the iterative workflow of exploratory data analysis.

## pandas: The Data Analysis Library

**pandas** (Panel Data Analysis) is Python's premier data analysis library. Its core data structure is the **DataFrame** — a two-dimensional table with labeled rows (index) and columns, similar to a spreadsheet but with powerful programmatic manipulation.

Before we look at specific operations, two key terms: the **index** is the row label (often a timestamp for sensor data), and **columns** are the variable labels (temperature, pH, EC). A **Series** is a single column of a DataFrame — a 1-dimensional labeled array.

### DataFrame Creation and Structure

```python
import pandas as pd

# Create from a dictionary
data = {
    "timestamp": [1717000000, 1717000300, 1717000600],
    "temperature": [22.5, 22.7, 22.6],
    "ph": [6.42, 6.38, 6.40],
    "ec": [1.85, 1.84, 1.86]
}
df = pd.DataFrame(data)
print(df.dtypes)
```

Output:
```
timestamp      int64
temperature    float64
ph             float64
ec             float64
```

### Reading CSV with pandas

```python
df = pd.read_csv("hydro_log.csv")
print(df.shape)   # (rows, columns) — e.g., (8640, 4) for 30 days at 5-min intervals
print(df.head())
```

`pd.read_csv()` is the entry point for most data analysis projects — it reads a CSV file from disk (or URL) into a DataFrame with type inference.

### Date-Time Parsing with pandas

Unix timestamps (integers) are hard to work with directly — it's much easier to work with human-readable datetime objects. pandas provides `pd.to_datetime()` for conversion:

```python
df["datetime"] = pd.to_datetime(df["timestamp_unix"], unit="s")
df = df.set_index("datetime")   # Use datetime as the row index
```

With a DatetimeIndex, pandas gains powerful time-aware capabilities: slicing by date range, resampling to hourly averages, and aligning multiple datasets by time.

```python
# Slice by date range
df_week1 = df["2024-05-01":"2024-05-07"]

# Slice a specific day
df_day1 = df["2024-05-01"]
```

### DataFrame Indexing and Slicing

pandas provides two indexers for accessing DataFrame data:

- **`.loc[]`** — label-based: `df.loc["2024-05-01", "ph"]` selects by row label (date) and column name
- **`.iloc[]`** — position-based: `df.iloc[0, 2]` selects by integer row and column position
- **Boolean indexing**: `df[df["ph"] < 5.5]` returns all rows where pH is below the target range

```python
# Get all pH readings below 5.5 (out-of-range events)
low_ph_events = df[df["ph"] < 5.5]
print(f"Number of low-pH events: {len(low_ph_events)}")

# Get temperature readings during daytime (8am–8pm)
daytime = df.between_time("08:00", "20:00")
day_temps = daytime["temperature"]
```

## Time-Series Analysis

### Resampling Time-Series Data

**Resampling** aggregates time-series data to a different time resolution. Upsampling increases frequency (5-minute to 1-minute, filling gaps); downsampling decreases frequency (5-minute to hourly averages). Downsampling is the most common operation for hydroponic analysis.

```python
# Resample 5-minute readings to hourly averages
hourly = df.resample("1H").mean()

# Resample to daily statistics
daily = df.resample("1D").agg({
    "temperature": ["mean", "min", "max"],
    "ph": ["mean", "min", "max"],
    "ec": "mean"
})

print(daily.head(7))   # First week of daily stats
```

Resampling to hourly or daily averages is essential for visualizing trends across a 35-day crop cycle — plotting every 5-minute reading produces unreadable charts.

### Rolling Window Statistics

A **rolling window** computes a statistic over a sliding time window. For sensor data, rolling averages smooth short-term noise; rolling standard deviations detect when readings become unusually variable (often an early sign of sensor fouling or system instability).

```python
# 1-hour rolling average (window=12 for 5-minute data)
df["ph_rolling_avg"] = df["ph"].rolling(window=12).mean()

# 4-hour rolling standard deviation
df["ph_rolling_std"] = df["ph"].rolling(window=48).std()

# Flag points where pH variation is high (potential alarm)
df["ph_unstable"] = df["ph_rolling_std"] > 0.15
```

Rolling statistics are the foundation of **Statistical Process Control** (SPC), covered in Chapter 17.

!!! mascot-thinking "Rolling averages vs. resampling"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Cress holds chin thoughtfully">
    Rolling averages and resampling both smooth data, but differently. Resampling produces a new Series at reduced frequency (e.g., one point per hour from 12 five-minute readings). Rolling averages keep the original frequency but replace each point with the mean of the surrounding window — useful for smoothing while preserving the original time resolution. Use resampling for trend visualization across many days; use rolling averages for real-time noise reduction.

## Data Quality

### Missing Data Handling

Real sensor logs have gaps — the Wi-Fi drops, the battery drains, the sensor gives a bad reading. pandas represents missing values as `NaN` (Not a Number). Before analysis, you need a strategy for handling them.

```python
# Check for missing data
print(df.isnull().sum())
# Output:
# temperature    12
# ph             34
# ec              5

# Inspect where pH gaps occur
print(df[df["ph"].isnull()].index)

# Option 1: Drop rows with any NaN
df_clean = df.dropna()

# Option 2: Forward-fill (use last known value)
df_filled = df.fillna(method="ffill")

# Option 3: Interpolate (linear interpolation between surrounding values)
df_interp = df.interpolate(method="time")
```

For hydroponic analysis, **linear interpolation** is usually appropriate for gaps under 1 hour — pH and EC change slowly enough that linear interpolation is close to the true values. For longer gaps, flag the interpolated period in your analysis to avoid drawing conclusions from reconstructed data.

### Data Cleaning and Validation

Beyond missing data, sensor logs often contain **outliers** — readings that are clearly wrong (pH = 14.7, temperature = 99.9 °C from a sensor that momentarily disconnected). Before analysis, validate the data against physical limits:

```python
VALID_RANGES = {
    "ph": (3.0, 11.0),
    "ec": (0.0, 10.0),
    "temperature": (5.0, 45.0)
}

def validate_range(series, col_name):
    lo, hi = VALID_RANGES[col_name]
    out_of_range = (series < lo) | (series > hi)
    series[out_of_range] = float("nan")   # Replace with NaN
    return series

df["ph"] = validate_range(df["ph"], "ph")
df["temperature"] = validate_range(df["temperature"], "temperature")
```

After validation and interpolation, your DataFrame is ready for statistical analysis.

!!! mascot-warning "Clean data before drawing conclusions"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Cress raises a cautionary hand">
    A single erroneous reading (pH = 14.7 from a disconnected sensor) will dramatically skew your mean, standard deviation, and correlation calculations. Always validate against physical limits and inspect for obvious outliers before analysis. The `df.describe()` output shows min and max — check those numbers first.

## NumPy: Numerical Computing

**NumPy** (Numerical Python) is the foundational library for numerical computation in Python. pandas is built on top of NumPy, and many scientific Python packages use NumPy arrays as their data format.

### NumPy Arrays

A **NumPy array** (`ndarray`) is a homogeneous, typed array — all elements have the same data type (e.g., all float64). NumPy arrays support element-wise operations, which are much faster than Python `for` loops because they use optimized C code under the hood.

```python
import numpy as np

# Create from a list
temps = np.array([22.1, 22.5, 22.3, 22.8, 22.0])

# Element-wise operations
temps_fahrenheit = temps * 9/5 + 32
temps_centered = temps - temps.mean()

# Convert a pandas Series to NumPy array
ph_array = df["ph"].to_numpy()
```

### Array Operations and Broadcasting

**Broadcasting** is NumPy's rule for performing operations between arrays of different shapes. The most common form: a scalar operation applied to an entire array (as shown in the Celsius-to-Fahrenheit conversion above — Python multiplies each element by 9/5 without an explicit loop).

More complex broadcasting:

```python
# Normalize each column to 0-1 range
ec_array = df["ec"].to_numpy()
ec_normalized = (ec_array - ec_array.min()) / (ec_array.max() - ec_array.min())
```

### Statistical Functions in NumPy

NumPy provides optimized implementations of statistical functions that work on arrays:

```python
ph = df["ph"].dropna().to_numpy()

mean_ph = np.mean(ph)         # Arithmetic mean
median_ph = np.median(ph)     # Median (50th percentile)
std_ph = np.std(ph)           # Standard deviation
var_ph = np.var(ph)           # Variance
min_ph = np.min(ph)
max_ph = np.max(ph)
percentile_25 = np.percentile(ph, 25)   # 25th percentile

print(f"pH stats: mean={mean_ph:.2f}, std={std_ph:.3f}, "
      f"min={min_ph:.2f}, max={max_ph:.2f}")
```

**Mean, median, and standard deviation** are the three most important summary statistics for hydroponic analysis:

- **Mean**: Average pH/EC over the crop cycle — was the setpoint maintained?
- **Median**: Less sensitive to outliers than mean — better for understanding typical conditions
- **Standard deviation**: How much the value varied — low std = stable; high std = unstable system or sensor issues

## Correlation and Regression

### Correlation Analysis

**Correlation** measures the linear relationship between two variables. The **Pearson correlation coefficient** ranges from −1 (perfect negative correlation) to +1 (perfect positive correlation), with 0 indicating no linear relationship.

```python
# Correlation between pH and EC (often negatively correlated — as plants
# take up nutrients, EC drops and root exudates acidify the solution)
corr_ph_ec = np.corrcoef(
    df["ph"].dropna(),
    df["ec"].dropna()
)[0, 1]
print(f"Correlation between pH and EC: {corr_ph_ec:.3f}")

# Full correlation matrix for all sensor columns
corr_matrix = df[["temperature", "ph", "ec"]].corr()
print(corr_matrix)
```

Useful correlations to investigate in hydroponic data:

- **pH vs. EC**: Usually weakly negative (nutrient uptake acidifies solution)
- **Temperature vs. DO**: Strongly negative (warmer water holds less dissolved oxygen)
- **CO₂ vs. time of day**: Tracks plant photosynthesis cycles (CO₂ drops during lights-on)

### Linear Regression

**Linear regression** fits a straight line to data: \( y = mx + b \). In hydroponic analysis, regression reveals trends — is pH drifting upward over the crop cycle? Is EC decreasing faster in week 3 than week 1?

**`numpy.polyfit()`** fits a polynomial of specified degree. For linear regression (degree 1), it returns the slope `m` and intercept `b`:

```python
# Days since start as x, pH as y
days = np.arange(len(daily_ph))
ph_values = daily_ph.values

# Fit linear regression: degree 1
coefficients = np.polyfit(days, ph_values, 1)
slope = coefficients[0]     # pH change per day
intercept = coefficients[1] # pH at day 0

print(f"pH trend: {slope:+.4f} pH units/day")
# Positive: pH drifting up; negative: drifting down

# Generate the fitted line for plotting
ph_fit = np.poly1d(coefficients)
ph_trend_line = ph_fit(days)
```

A pH slope of +0.05 pH/day means the solution is slowly becoming more alkaline — a signal to check the potassium buffer capacity of the nutrient solution or increase pH adjustment frequency.

!!! mascot-encourage "Regression reveals trends invisible in daily monitoring"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Cress gives an encouraging nod">
    When you check pH daily, you see the current reading. When you fit a regression line to 30 days of pH data, you see the slope — whether the system is drifting, how fast, and whether that rate changed after you modified the nutrient formulation. This is the difference between reactive management and understanding your system. The math is simple; the insight is powerful.

#### Diagram: Sensor Data Analysis Pipeline
<iframe src="../../sims/sensor-data-pipeline/main.html" width="100%" height="500px" scrolling="no"></iframe>
<details markdown="1">
<summary>Hydroponic Sensor Data Analysis Pipeline Interactive Demo</summary>
Type: interactive-analysis
**sim-id:** sensor-data-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Simulate a 35-day crop cycle dataset (synthetic pH, EC, temperature readings at 5-minute intervals) and allow students to apply each analysis step — load, clean, resample, rolling average, correlation, regression — and observe the output update in real-time.

Bloom Level: Apply (L3) and Analyze (L4)
Bloom Verb: Apply — students apply data analysis operations to a simulated dataset and observe how each step transforms the data.

Layout: Canvas 900×500. Split into left panel (analysis controls) and right panel (data visualization).

Left panel — analysis steps (checkboxes and sliders):
1. "Add simulated noise" slider (0–100%) — adds random noise to the synthetic dataset
2. "Add missing data gaps" slider (0–20%) — randomly NaN-ifies readings
3. "Apply validation" checkbox — remove out-of-range values
4. "Fill missing data" dropdown — None / Forward Fill / Interpolate
5. "Resample to" dropdown — 5 min / 15 min / 1 hour / 1 day
6. "Rolling window" slider (1–48 readings)
7. "Show regression line" checkbox
8. "Show ±1 std band" checkbox

Right panel — time series chart showing:
- Raw data (gray points, can be toggled)
- Cleaned/interpolated data (blue line)
- Resampled data (orange line)
- Rolling average (green line)
- Regression trend line (red dashed)
- ±1 std band (shaded green)

Below chart: stats panel showing real-time values: mean, median, std, min, max, trend slope (pH/day).

Interactivity: All left-panel changes update the chart instantly. Hovering the chart shows a vertical cursor with the exact values at that timestamp. Toggle "View Mode" to switch between pH / EC / Temperature.
</details>

## Key Takeaways

- **Data collection strategy** decisions — what to measure, at what interval, and where to store it — determine whether the logged data can answer your crop performance questions.
- **CSV format** with a header row and Unix timestamps is the simplest and most portable logging format; write a header once at cycle start, append rows during operation.
- **SD cards** provide local storage without Wi-Fi; **Google Sheets** and cloud databases provide remote access and collaborative analysis.
- **Jupyter notebooks** (or Google Colab) provide an interactive code-and-output environment ideal for exploratory data analysis.
- **pandas DataFrames** organize sensor data into labeled, indexed tables; `pd.read_csv()` loads CSV logs; `pd.to_datetime()` converts Unix timestamps to DatetimeIndex for time-aware operations.
- **Resampling** aggregates data to a lower frequency (5-minute → hourly → daily) for trend visualization; **rolling windows** smooth noise while preserving original time resolution.
- **Missing data** should be handled by validation (remove physically impossible values), forward-fill (for short gaps), or linear interpolation (for gaps under 1 hour).
- **NumPy** provides fast array operations and statistical functions; `np.mean()`, `np.std()`, `np.percentile()` are essential summary statistics for crop performance review.
- **Correlation** (`np.corrcoef()`) quantifies linear relationships between sensor variables; pH vs. EC, temperature vs. dissolved oxygen.
- **Linear regression** (`np.polyfit()`) fits a trend line to time-series data; the slope reveals whether pH or EC is drifting over the crop cycle.

!!! mascot-celebration "Chapter 16 complete — you're a hydro data scientist!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Cress leaps with arms raised">
    You can now transform a raw CSV log from a 35-day lettuce crop into a clean, analyzed dataset with trend lines, correlation matrices, and statistical summaries. Chapter 17 takes these numbers and makes them visible: Matplotlib and Plotly charts, real-time streaming dashboards, Statistical Process Control charts, and anomaly detection. The data story becomes a data picture — let's draw it!
