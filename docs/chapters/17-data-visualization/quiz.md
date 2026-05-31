# Quiz: Data Visualization

Test your understanding of Matplotlib, Plotly, real-time dashboards, statistical process control charts, and anomaly detection visualization for hydroponics monitoring systems with these questions.

---

#### 1. In Matplotlib, what is the object-oriented approach to creating a figure with two subplots sharing the same x-axis (time), and why is `sharex=True` important?

<div class="upper-alpha" markdown>
1. Use `plt.plot()` twice in sequence — Matplotlib automatically shares axes when two plots are created consecutively
2. Use `fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True)` — creates two Axes objects that share the x-axis, so zooming or panning one subplot moves both simultaneously
3. Use `plt.subplot(2, 1)` twice — the integer arguments define shared axes automatically
4. Shared x-axes are only possible in Plotly — Matplotlib requires separate time columns for each subplot
</div>

??? question "Show Answer"
    The correct answer is **B**. `plt.subplots(nrows, ncols, sharex=True)` creates multiple Axes objects that share the x-axis. When the user zooms into a time range on one subplot, the other subplot automatically adjusts to show the same time range — essential for comparing pH, EC, and temperature data measured at the same timestamps. Without `sharex=True`, each subplot has an independent x-axis, making temporal correlation visually difficult to assess. The object-oriented API (`fig, axes = plt.subplots(...)`) is preferred over the stateful `plt.subplot()` API for multi-subplot figures.

    **Concept Tested:** Matplotlib Subplots

---

#### 2. What Matplotlib function creates a shaded region between two horizontal lines (e.g., the optimal EC range of 1.5–2.5 mS/cm) on a time-series plot?

<div class="upper-alpha" markdown>
1. `ax.axhline(1.5)` and `ax.axhline(2.5)` — two horizontal lines define the zone boundaries
2. `ax.fill_between(time, 1.5, 2.5, alpha=0.2, color="green")` — shades the region between y=1.5 and y=2.5 across the full time range with transparency
3. `ax.shade_region(ymin=1.5, ymax=2.5)` — the shade_region method fills bounded areas on a plot
4. `ax.rectangle(x=0, y=1.5, width=len(time), height=1.0)` — a rectangle patch defines the target zone
</div>

??? question "Show Answer"
    The correct answer is **B**. `ax.fill_between(x, y1, y2)` fills the area between two y values across the range of x values. For a constant target zone: `ax.fill_between(time_array, 1.5, 2.5, alpha=0.2, color="green")` shades the optimal EC range across the entire time axis with 20% transparency, allowing the actual EC line to remain visible through the shading. `axhline()` (option A) draws the boundary lines but does not fill the region between them — combining both is good practice for clarity. This is the standard approach for visualizing control limits and target ranges.

    **Concept Tested:** Target Zone Visualization

---

#### 3. A Plotly Express line chart is created for EC time-series data. What is the primary advantage of a Plotly chart over a Matplotlib chart for sharing with non-technical stakeholders?

<div class="upper-alpha" markdown>
1. Plotly charts render faster than Matplotlib on computers with less than 4 GB of RAM
2. Plotly charts are interactive — stakeholders can hover to see exact values, zoom into specific time periods, and toggle sensor lines on/off without any code, in a standard web browser
3. Plotly automatically corrects outlier data points before displaying them
4. Plotly charts include a statistical summary table below the graph by default
</div>

??? question "Show Answer"
    The correct answer is **B**. Plotly generates HTML-based interactive charts: hovering over a data point shows the exact timestamp and value tooltip; clicking and dragging zooms into a time range; double-clicking resets the view; clicking legend items toggles individual sensor lines on and off. All of this requires no code or specialized software — just a web browser. For sharing crop cycle data with farm managers, investors, or school administrators who lack Python skills, Plotly's interactivity provides far more analytical value than a static Matplotlib PNG image.

    **Concept Tested:** Plotly Interactive Charts

---

#### 4. A Plotly Dash application displays live nutrient solution sensor data and should update every 30 seconds without user interaction. Which Dash component enables automatic periodic updates?

<div class="upper-alpha" markdown>
1. `dcc.LiveUpdate(interval=30000)` — the LiveUpdate component refreshes all charts every 30 seconds
2. `dcc.Interval(id="timer", interval=30000, n_intervals=0)` — triggers a callback every 30,000 milliseconds (30 seconds) that can update charts with new sensor data
3. `html.Meta(http-equiv="refresh", content="30")` — standard HTML meta refresh works inside Dash
4. Real-time updates in Dash require websocket connections — polling-based updates are not supported
</div>

??? question "Show Answer"
    The correct answer is **B**. `dcc.Interval` is the Dash component for timer-based callbacks. It fires a callback at the specified interval in milliseconds (`interval=30000` = 30 seconds). The callback function reads the latest sensor data, creates an updated figure, and returns it to the chart component. `n_intervals` starts at 0 and increments with each tick, giving the callback awareness of how many intervals have elapsed. This is the standard pattern for real-time dashboards in Dash — no websockets required for polling-based updates at human-relevant frequencies.

    **Concept Tested:** Real-Time Dashboard

---

#### 5. In a Statistical Process Control (SPC) chart for pH monitoring, the Upper Control Limit (UCL) and Lower Control Limit (LCL) are defined as mean ± 3σ. For 30 days of pH data with mean = 6.2 and standard deviation = 0.15, what are the UCL and LCL values?

<div class="upper-alpha" markdown>
1. UCL = 6.65, LCL = 5.75
2. UCL = 6.35, LCL = 6.05
3. UCL = 6.5, LCL = 5.9
4. UCL = 7.2, LCL = 5.2
</div>

??? question "Show Answer"
    The correct answer is **A**. UCL = mean + 3σ = 6.2 + 3(0.15) = 6.2 + 0.45 = 6.65. LCL = mean − 3σ = 6.2 − 3(0.15) = 6.2 − 0.45 = 5.75. In SPC theory, ±3σ control limits contain 99.73% of values from a normally distributed process. Any reading outside these limits triggers investigation — it represents a statistically unusual event unlikely to occur by random variation alone. For pH, a reading of 6.7 (above UCL 6.65) would flag an investigation into CO₂ depletion, nutrient formula error, or pH-Up dosing miscalibration.

    **Concept Tested:** SPC Control Charts

---

#### 6. What is the Z-score method for anomaly detection, and how would a Z-score threshold of 3.0 be applied to EC sensor data?

<div class="upper-alpha" markdown>
1. Z-score identifies readings that differ from the median by more than 3 units of EC (mS/cm)
2. Z-score = (reading − mean) / standard deviation; readings with |Z| > 3.0 are more than 3 standard deviations from the mean and flagged as anomalies requiring investigation
3. Z-score is calculated as (reading − minimum) / (maximum − minimum); values above 3.0 are anomalous
4. Z-score anomaly detection only works for normally distributed data and cannot be applied to EC measurements
</div>

??? question "Show Answer"
    The correct answer is **B**. The Z-score normalizes each reading by expressing how many standard deviations it is from the distribution mean: Z = (x − μ) / σ. For a mean EC of 1.8 mS/cm with σ = 0.2, a reading of 2.5 mS/cm has Z = (2.5 − 1.8) / 0.2 = 3.5 — above the 3.0 threshold, flagged as anomalous. This corresponds to the same logic as SPC: 3σ limits contain 99.73% of normal variation, so |Z| > 3 readings are statistically exceptional. Implementation: `z_scores = (df["ec"] - df["ec"].mean()) / df["ec"].std(); anomalies = df[abs(z_scores) > 3.0]`.

    **Concept Tested:** Z-Score Anomaly Detection

---

#### 7. A grower uses a heatmap to visualize 90 days of hourly temperature data. What information does a heatmap reveal that a simple line chart cannot easily show?

<div class="upper-alpha" markdown>
1. Heatmaps display more data points than line charts because they compress time into color
2. Heatmaps reveal periodic patterns — daily temperature cycles, weekly patterns from different staff schedules — by arranging data in a 2D grid (e.g., hour of day vs. day of week) where color intensity shows value magnitude
3. Heatmaps show the standard deviation of each reading, unlike line charts that only show point values
4. Heatmaps are identical to line charts in information content — they are just a visual preference
</div>

??? question "Show Answer"
    The correct answer is **B**. A 2D heatmap with hour-of-day on the y-axis and day-number on the x-axis (or day-of-week × week-of-cycle) encodes temperature as color intensity. This layout makes periodic patterns immediately visible: daily temperature cycles (warmer during lights-on hours) appear as horizontal bands; irregular events (HVAC failures, hot weekends) appear as colored vertical stripes on specific days. A line chart of 90 days × 24 hours = 2,160 points is too dense to read individual values and obscures periodic structure that is obvious in a heatmap.

    **Concept Tested:** Heatmap Visualization

---

#### 8. What is the IQR (Interquartile Range) method for outlier detection, and why is it preferable to Z-score for EC sensor data that is not normally distributed?

<div class="upper-alpha" markdown>
1. IQR is faster to calculate than Z-score because it does not require computing the standard deviation
2. IQR (Q3 − Q1) is based on the middle 50% of the data and is not affected by extreme outliers in the tails, making it robust for skewed or non-normal distributions; outliers are defined as values below Q1 − 1.5×IQR or above Q3 + 1.5×IQR
3. IQR detects cyclical patterns in sensor data; Z-score only detects absolute magnitude anomalies
4. IQR requires the data to be time-sorted; Z-score works on unordered datasets
</div>

??? question "Show Answer"
    The correct answer is **B**. Z-score uses mean and standard deviation — both are heavily influenced by outliers themselves. If EC has a few extreme spike readings, the mean and standard deviation are distorted, making the Z-score threshold less reliable at detecting additional outliers. IQR uses Q1 (25th percentile) and Q3 (75th percentile), which are resistant to extreme values. The fence method (Q1 − 1.5×IQR, Q3 + 1.5×IQR) is Tukey's boxplot outlier definition — robust for real-world sensor data that often has skewed distributions due to occasional equipment malfunctions or calibration drift.

    **Concept Tested:** IQR Outlier Detection

---

#### 9. A grower creates a scatter plot of PPFD (light intensity) versus fresh weight at harvest across 20 lettuce crops. What additional plot element should be added to help visually assess whether a linear relationship exists?

<div class="upper-alpha" markdown>
1. A histogram of PPFD values should be overlaid to show the distribution of light conditions tested
2. A best-fit regression line calculated with `np.polyfit()` should be plotted on top of the scatter points, along with the R² value displayed in the legend or title
3. Error bars showing ±1 standard deviation around each point should be added to validate the measurement
4. A secondary y-axis showing EC values should be added because fresh weight is only meaningful when nutrient concentration is also displayed
</div>

??? question "Show Answer"
    The correct answer is **B**. A scatter plot of two variables shows the data distribution, but adding a best-fit line makes the linear trend (or lack thereof) immediately visible. `np.polyfit(ppfd, fresh_weight, 1)` returns slope and intercept; plotting the resulting line through the scatter points lets viewers visually assess how well the linear model fits. Displaying R² (coefficient of determination, ranging 0–1) quantifies what fraction of weight variation is explained by PPFD variation. A high R² with a consistent trend supports a strong relationship; scatter around the line with low R² suggests other factors dominate.

    **Concept Tested:** Regression Visualization

---

#### 10. A real-time Plotly Dash dashboard for a commercial hydroponics facility needs to display the most recent 24 hours of data for multiple sensors, updating every minute. What is the most important design consideration to prevent dashboard performance degradation over time?

<div class="upper-alpha" markdown>
1. Use only green and blue colors in the chart to reduce GPU rendering load
2. Query only the most recent 24 hours of data from the database or log file on each update, rather than loading the entire historical dataset and filtering in Python — the query should be bounded in time to maintain constant data volume per update
3. Increase the update interval to every 10 minutes to reduce server load
4. Store all sensor data in RAM as a global Python variable so the disk is not accessed on each update
</div>

??? question "Show Answer"
    The correct answer is **B**. A common dashboard pitfall: the first version works well because there is only one day of data. After 6 months, the CSV or database has 260,000+ rows. If the callback loads the entire file and filters it, each 1-minute update reads a growing dataset — update latency increases from milliseconds to seconds. The correct approach is to bound the query at the database or file level: `SELECT * FROM readings WHERE timestamp >= NOW() - INTERVAL '24 hours'` retrieves a constant volume of ~1,440 rows (at 1/minute) regardless of total history size. This keeps dashboard update latency constant across the entire multi-year facility operation.

    **Concept Tested:** Dashboard Performance

---
