import matplotlib.pyplot as plt
import numpy as np

# Data
categories = ['Basic CRUD Operations', 'AI Prediction Requests']
values = [40, 120]
colors = ['#4A90E2', '#50C878']  # Soft professional blue and green

# Create the figure with a white background and high resolution
fig, ax = plt.subplots(figsize=(16, 9), dpi=150)
fig.patch.set_facecolor('white')
ax.set_facecolor('white')

# Create bars
bars = ax.bar(categories, values, color=colors, width=0.5, edgecolor='none')

# Labels and Title
ax.set_title("API Response Time Distribution", fontsize=28, fontweight='bold', pad=30, color='#333333')
ax.set_xlabel("Operation Type", fontsize=20, labelpad=20, color='#333333')
ax.set_ylabel("Response Time (milliseconds)", fontsize=20, labelpad=20, color='#333333')

# Axis limits and ticks
ax.set_ylim(0, 150)
ax.tick_params(axis='both', which='major', labelsize=16, colors='#333333')

# Add value labels on top of each bar
for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 3,
            f'{height} ms', ha='center', va='bottom', fontsize=18, fontweight='bold', color='#333333')

# Annotations
ax.annotate('Fast database operations', 
            xy=(0, 40), 
            xytext=(0.25, 60),
            arrowprops=dict(facecolor='black', shrink=0.05, width=1.5, headwidth=8, alpha=0.6),
            fontsize=16, color='#555555', ha='left')

ax.annotate('Includes ML computation overhead', 
            xy=(1, 120), 
            xytext=(0.75, 135),
            arrowprops=dict(facecolor='black', shrink=0.05, width=1.5, headwidth=8, alpha=0.6),
            fontsize=16, color='#555555', ha='right')

# Style adjustments
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_linewidth(1.5)
ax.spines['bottom'].set_linewidth(1.5)
ax.grid(axis='y', linestyle='--', alpha=0.3, color='#999999')

# Save the plot
plt.tight_layout()
plt.savefig('10_API_Performance_BarChart.png', format='png', facecolor='white', bbox_inches='tight')
print("Generated 10_API_Performance_BarChart.png")
