import subprocess
import sys

try:
    import matplotlib.pyplot as plt
    from matplotlib.ticker import MultipleLocator
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "matplotlib"])
    import matplotlib.pyplot as plt
    from matplotlib.ticker import MultipleLocator

# Create the figure with a white background and specific high resolution size (1920x1080 approx is 16x9 at 150 DPI = 2400x1350)
fig, ax = plt.subplots(figsize=(16, 9), dpi=150)
fig.patch.set_facecolor('white')
ax.set_facecolor('white')

# Data
trees = [10, 20, 50, 80, 100, 150, 200]
accuracy = [45, 52, 62, 66.5, 68, 68.5, 68.7]

# Plot line with markers
ax.plot(trees, accuracy, color='#113355', linewidth=3.5, marker='o', markersize=12, markerfacecolor='#113355')

# Labels and Title
ax.set_title("Random Forest Model Accuracy vs Number of Trees", fontsize=26, fontweight='bold', pad=20, color='black')
ax.set_xlabel("Number of Trees (Estimators)", fontsize=20, labelpad=15, color='black')
ax.set_ylabel("Accuracy (%)", fontsize=20, labelpad=15, color='black')

# Axis limits
ax.set_ylim(30, 75)
ax.set_xlim(0, 215)

# Ticks
ax.tick_params(axis='both', which='major', labelsize=16, colors='black')

# Grid
ax.grid(True, linestyle='--', alpha=0.7, color='#dddddd')

# Reference Line
ax.axhline(y=33.3, color='#888888', linestyle='--', linewidth=2.5)
ax.text(105, 34.5, 'Random Guess Baseline', color='#666666', fontsize=16, va='bottom', ha='center', fontweight='bold')

# Annotation
ax.annotate('Optimal Performance (~68%)', 
            xy=(100, 68), 
            xytext=(100, 72),
            arrowprops=dict(facecolor='black', shrink=0.05, width=2, headwidth=10),
            fontsize=18, fontweight='bold', ha='center', color='black')

# Hide top and right spines
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_linewidth(1.5)
ax.spines['bottom'].set_linewidth(1.5)

# Save
plt.tight_layout()
plt.savefig('9_RF_Performance_Graph.png', format='png', facecolor='white', bbox_inches='tight')
print("Generated 9_RF_Performance_Graph.png")
