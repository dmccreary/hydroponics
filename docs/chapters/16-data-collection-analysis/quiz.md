# Quiz: Data Collection and Analysis

Test your understanding of CSV logging, pandas data analysis, time-series resampling, rolling averages, NumPy statistics, and regression analysis for hydroponics sensor data with these questions.

---

#### 1. A MicroPython controller is logging sensor data to a CSV file on flash storage. The header row (`timestamp,ph,ec,temp`) is written once when the file is created, but subsequent readings must be added without re-writing the header. What is the correct file opening mode for appending new sensor readings?

<div class="upper-alpha" markdown>
1. `open("log.csv", "w")` — write mode always appends to the end of the file
2. `open("log.csv", "a")` — append mode adds new data to the end without modifying existing content or re-writing the header
3. `open("log.csv", "r+")` — read-write mode allows adding data while preserving existing content
4. `open("log.csv", "x")` — exclusive creation mode opens existing files for appending
</div>

??? question "Show Answer"
    The correct answer is **B**. Python/MicroPython file mode `"a"` (append) opens the file and positions the write pointer at the end, adding new content without touching existing data. Mode `"w"` (write) truncates the file to zero bytes on open — opening in `"w"` mode after the header was written would delete all previous sensor readings. The correct pattern is: (1) check if file exists; (2) if not, open in `"w"` and write the header; (3) for all subsequent writes, open in `"a"` and write data rows only. This builds a growing time-series log without header duplication or data loss.

    **Concept Tested:** CSV Header and Append Mode

---

#### 2. After loading a CSV of hydroponics sensor data into a pandas DataFrame with `df = pd.read_csv("log.csv")`, the timestamp column is a string type. What must be done before performing time-based analysis like resampling?

<div class="upper-alpha" markdown>
1. Nothing — pandas automatically interprets ISO format strings as datetime objects when reading CSV
2. Convert the timestamp column to datetime type with `df["timestamp"] = pd.to_datetime(df["timestamp"])` and set it as the index with `df.set_index("timestamp", inplace=True)`
3. Rename the column to "date" — pandas only recognizes datetime columns named "date" or "time"
4. Sort the DataFrame by the timestamp string column alphabetically — ISO format strings sort correctly without conversion
</div>

??? question "Show Answer"
    The correct answer is **B**. `pd.read_csv()` reads all columns as strings by default unless dtype is specified. Datetime-specific operations — `resample()`, `between_time()`, date range filtering — require the column to be of `datetime64` dtype. `pd.to_datetime()` parses ISO 8601 strings (YYYY-MM-DDTHH:MM:SS) into proper datetime objects. Setting the datetime column as the DataFrame index (`set_index()`) enables time-based indexing and is required for `resample()` to work. Without this conversion, attempting `df.resample("1H")` raises a TypeError because pandas cannot resample string columns.

    **Concept Tested:** Time-Series Data Processing

---

#### 3. A grower has hourly pH readings for a 60-day lettuce cycle and wants to identify the daily average pH trend. Which pandas operation produces a DataFrame of daily mean pH values?

<div class="upper-alpha" markdown>
1. `df["ph"].mean()` — returns the mean of all pH values across the entire 60-day period
2. `df["ph"].resample("D").mean()` — resamples hourly data to daily frequency, calculating the mean of all hourly readings within each calendar day
3. `df["ph"].rolling(window=24).mean()` — computes a 24-hour rolling average for each hour
4. `df.groupby(df.index.date)["ph"].transform("mean")` — groups by date and fills each row with the day's mean
</div>

??? question "Show Answer"
    The correct answer is **B**. `resample("D")` is the correct pandas method for downsampling time-series data to a lower frequency (daily, in this case). It groups all rows within each calendar day and applies the aggregation function (`.mean()`), returning one row per day with the mean pH. This produces a 60-row DataFrame of daily averages — ideal for visualizing pH trends over a crop cycle. Rolling average (option C) calculates a trailing window at each hour, not a daily aggregate. Option A returns a single scalar value, not a time series.

    **Concept Tested:** Pandas Resample

---

#### 4. Sensor data from a malfunctioning EC probe contains several `NaN` (not a number) values where readings failed. Before computing statistics, what pandas method most appropriately fills these gaps in a continuous sensor time series?

<div class="upper-alpha" markdown>
1. `df["ec"].fillna(0)` — replace NaN values with 0 to preserve row count without distorting statistics
2. `df["ec"].fillna(method="ffill")` or `df["ec"].interpolate()` — forward-fill from the last valid reading or interpolate between surrounding valid values to estimate missing sensor readings
3. `df["ec"].dropna()` — remove all rows with NaN values to ensure clean statistics
4. `df["ec"].fillna(df["ec"].mean())` — fill all missing values with the column mean to preserve the overall average
</div>

??? question "Show Answer"
    The correct answer is **B**. For continuous sensor time-series data, forward-fill (`ffill`) is the most contextually appropriate imputation: it assumes the most recent valid reading is a reasonable estimate for a missing reading. `interpolate()` is even better when the sensor is expected to change gradually (like EC drift over hours) — it linearly interpolates between the last valid and next valid readings. Filling with 0 inserts physically impossible EC values. `dropna()` creates time gaps that break resampling operations. Mean-fill ignores time structure and may insert average values during known anomalous periods.

    **Concept Tested:** Handling Missing Data

---

#### 5. Using NumPy, a grower has 30 days of daily nutrient solution temperature readings. What function returns the 95th percentile temperature, and why is this more useful than the maximum?

<div class="upper-alpha" markdown>
1. `np.mean(temps)` — the mean represents typical temperature better than extremes
2. `np.percentile(temps, 95)` — the 95th percentile shows the temperature exceeded only 5% of the time, filtering out isolated extreme spikes that inflate the maximum
3. `np.max(temps)` — the maximum is always the most important value for thermal stress analysis
4. `np.std(temps)` — standard deviation represents temperature variability better than any single percentile
</div>

??? question "Show Answer"
    The correct answer is **B**. The maximum temperature may reflect a single 5-minute spike (equipment malfunction, brief power failure) that is not representative of thermal stress experienced by the crop. `np.percentile(temps, 95)` returns the value below which 95% of readings fall — a much better characterization of the "worst typical" temperature the crop endures. If the 95th percentile is 24°C (safe), but the maximum was 32°C for a brief malfunction, the 95th percentile correctly indicates the crop was not chronically heat-stressed even though a spike occurred.

    **Concept Tested:** NumPy Percentile Analysis

---

#### 6. A grower suspects that EC (nutrient concentration) positively correlates with plant growth rate. Using NumPy, how is the Pearson correlation coefficient calculated between two arrays, and what values indicate strong positive correlation?

<div class="upper-alpha" markdown>
1. `np.correlate(ec, growth)` — returns the cross-correlation; values above 100 indicate positive correlation
2. `np.corrcoef(ec, growth)[0, 1]` — returns the Pearson r coefficient; values from 0.7 to 1.0 indicate strong positive correlation
3. `np.polyfit(ec, growth, 1)[0]` — the slope of the best-fit line; positive slopes indicate positive correlation
4. `np.cov(ec, growth)` — the covariance matrix diagonal indicates correlation strength
</div>

??? question "Show Answer"
    The correct answer is **B**. `np.corrcoef(a, b)` returns a 2×2 correlation matrix; element `[0, 1]` (or `[1, 0]`) is the Pearson r coefficient. Values range from −1 to +1: +1 is perfect positive correlation, 0 is no linear relationship, −1 is perfect inverse correlation. Values of 0.7–1.0 indicate strong positive correlation. `np.polyfit()` (option C) returns the regression slope in original units, which can show direction but not normalized correlation strength across different unit scales. `np.correlate()` computes cross-correlation for signal processing, not the Pearson coefficient.

    **Concept Tested:** Correlation Analysis

---

#### 7. A linear regression using `np.polyfit(days, fresh_weight_grams, 1)` returns `[4.2, 15.3]`. What do these two values represent and what does this tell the grower about crop growth?

<div class="upper-alpha" markdown>
1. The first value (4.2) is R², indicating 42% of weight variation is explained by time; the second value (15.3) is the correlation coefficient
2. The first value (4.2) is the slope (grams per day of growth) and the second (15.3) is the y-intercept (estimated weight at day 0); the crop grows approximately 4.2 grams per day on average
3. The first value is the maximum weight reached; the second is the minimum weight at harvest time
4. The polynomial fit failed — two values indicate an underdetermined system requiring more data points
</div>

??? question "Show Answer"
    The correct answer is **B**. `np.polyfit(x, y, 1)` fits a first-degree polynomial (straight line) and returns `[slope, intercept]`. The slope (4.2) is the average grams per day of fresh weight gain across the measured period. The intercept (15.3) is the estimated weight at x=0 (day 0), which corresponds to seedling weight at transplant. This means the crop gains approximately 4.2 g/day on average. The grower can use this slope to compare growth rates across different nutrient formulas, light intensities, or cultivars — a higher slope means faster biomass accumulation.

    **Concept Tested:** Linear Regression

---

#### 8. A grower exports a crop cycle's EC and pH data from a pandas DataFrame to a new CSV for sharing with a colleague. Which pandas method creates the file correctly?

<div class="upper-alpha" markdown>
1. `df.write_csv("output.csv")` — the write_csv method is the standard export function
2. `df.to_csv("output.csv", index=False)` — to_csv exports the DataFrame; index=False prevents writing the numeric row index as an extra column
3. `df.to_csv("output.csv")` — the index is automatically excluded when not specified
4. `pd.write_file(df, "output.csv", format="csv")` — pandas requires a format parameter for CSV export
</div>

??? question "Show Answer"
    The correct answer is **B**. `df.to_csv("output.csv")` is the correct method, but without `index=False`, pandas writes the DataFrame's row index (0, 1, 2, 3...) as the first column. This creates an extra unnamed column that confuses colleagues opening the file in Excel or loading it with `read_csv`. Always specify `index=False` when the index is a default integer index with no meaningful content. When the index IS meaningful (e.g., a datetime index), omit `index=False` to preserve it.

    **Concept Tested:** DataFrame Export

---

#### 9. What is the computational difference between `df["ph"].rolling(window=12).mean()` and `df["ph"].resample("1H").mean()` for data logged every 5 minutes?

<div class="upper-alpha" markdown>
1. Both operations produce identical results — rolling and resample are interchangeable for time-series smoothing
2. `rolling(12).mean()` computes a trailing 12-row (60-minute) moving average at each 5-minute interval, preserving the original row count; `resample("1H").mean()` groups rows by clock hour, reducing to one row per hour
3. `rolling()` only works on numeric columns; `resample()` works on any data type including strings
4. `resample("1H")` computes a 12-point rolling average; `rolling(12)` resamples to hourly frequency
</div>

??? question "Show Answer"
    The correct answer is **B**. `rolling(window=12).mean()` produces a smoothed value at every original time point (every 5 minutes), using the trailing 12 readings (= 60 minutes of data) for each calculation. The output has the same number of rows as the input. `resample("1H").mean()` groups all readings within each clock-hour window (e.g., 12:00–12:55) and returns one aggregate row per hour. The output has one row per hour. Rolling is used for smoothing while preserving temporal resolution; resample is used for downsampling to a coarser time scale. Both are useful in crop analysis but answer different questions.

    **Concept Tested:** Rolling vs Resample

---

#### 10. After analyzing 45 days of lettuce cycle data, a grower finds that EC readings above 2.8 mS/cm correlate with 23% lower fresh weight at harvest compared to readings below 2.4 mS/cm. How should this finding be reported to maximize its scientific credibility?

<div class="upper-alpha" markdown>
1. Post the correlation finding on social media immediately — 45 days of data is sufficient for publication-quality conclusions
2. Report it as a correlation with the sample size (n=45 days, one crop cycle), note that correlation does not establish causation, recommend replication across multiple crop cycles and cultivars before changing standard protocols
3. Immediately change the EC setpoint for all future crops — 45 days of data is more than sufficient to establish causal relationships in hydroponics
4. Discard the finding — a single 45-day dataset contains too few data points for any meaningful statistical conclusion
</div>

??? question "Show Answer"
    The correct answer is **B**. A 45-day single crop cycle dataset shows a correlation, not a causal relationship. Multiple confounding factors could explain the result: the high-EC period may have coincided with higher temperatures (also stressful), a lighting malfunction, or a different cultivar batch. The scientifically responsible approach is: (1) report the correlation with its sample size and measurement conditions; (2) explicitly state it is a correlation, not proven causation; (3) replicate the finding in controlled experiments with at least 3 independent crop cycles, preferably varying only EC while controlling other variables. This prevents costly protocol changes based on a single potentially confounded observation.

    **Concept Tested:** Scientific Interpretation of Data

---
