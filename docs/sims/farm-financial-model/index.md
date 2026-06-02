---
title: Hydroponic Farm Financial Model Builder
description: Enter CapEx, OpEx, and revenue inputs to calculate break-even, NPV, IRR, payback period, and a 5-year cash flow chart for a hydroponic operation.
status: scaffold
library: p5.js
bloom_level: Apply (L3) and Evaluate (L5)
---

# Hydroponic Farm Financial Model Builder



<iframe src="main.html" width="100%" height="742"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 21: Financial Modeling and Hydroponics Economics](../../chapters/21-financial-modeling/index.md).

```text
Type: financial-simulator
**sim-id:** farm-financial-model<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Allow students to build a complete financial model for a hydroponic operation by entering cost and revenue inputs, then see real-time calculation of break-even, NPV, IRR, payback period, and a 5-year cash flow chart.

Bloom Level: Apply (L3) and Evaluate (L5)
Bloom Verb: Evaluate — students construct a financial model for their specific scenario and assess viability.

Layout: Canvas 900×560. Four-column layout:

Column 1 (CapEx Inputs):
- Growing system cost ($)
- Lighting cost ($)
- HVAC/climate cost ($)
- Automation/sensors ($)
- Facility buildout ($)
- Total CapEx (calculated)

Column 2 (OpEx Inputs — monthly):
- Electricity ($/month)
- Water ($/month)
- Nutrients ($/month)
- Seeds/propagation ($/month)
- Labor (hrs × rate)
- Packaging ($/month)
- Loan payment (auto-calculated from CapEx)
- Total monthly OpEx (calculated)

Column 3 (Revenue Inputs — monthly):
- Growing area (m²)
- Yield per m² per cycle (kg)
- Cycles per year
- Selling price ($/kg)
- Market channel selector: Wholesale / Restaurant / Farmers Market / CSA
- Monthly revenue (calculated)

Column 4 (Results):
- Break-even volume (kg/month)
- Monthly profit/loss ($)
- Annual profit ($)
- NPV at 8% discount, 5 years ($)
- IRR (%)
- Payback period (years)
- ROI 5-year (%)

Bottom panel: 5-year stacked bar chart showing Revenue (green bars) and Cost bars (red = OpEx, orange = CapEx depreciation). Cumulative cash flow line overlaid.

Interactivity:
- All inputs update all results and the chart in real time.
- "Compare Solar vs Grid" button: adds a side-by-side energy cost comparison using the Chapter 19 solar model.
- "Run Monte Carlo": performs 1,000 simulations varying price ±30%, yield ±25%, and electricity ±20%, then shows a histogram of annual profit outcomes with percentile bands.
- "Export Business Plan Summary": downloads a formatted plain-text one-pager with all inputs and outputs.

Responsive: Scales to container width; on narrow screens, columns stack vertically.
```

## Related Resources

- [Chapter 21: Financial Modeling and Hydroponics Economics](../../chapters/21-financial-modeling/index.md)
