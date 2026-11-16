import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

out = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────────────────────────────────────────
# DIAGRAM 6 – Robo-Advisor Portfolio Allocation (Pie Chart)
# ─────────────────────────────────────────────────────────────
labels = ['IT & Technology', 'Banking & Finance', 'Pharmaceuticals',
          'Energy & Oil', 'FMCG', 'Infrastructure']
sizes  = [25, 20, 15, 15, 15, 10]
colors = ['#4A90D9', '#27AE60', '#E67E22', '#E74C3C', '#8E44AD', '#16A085']
explode = (0.03, 0.03, 0.03, 0.03, 0.03, 0.03)

fig, ax = plt.subplots(figsize=(10, 7), facecolor='white')
wedges, texts, autotexts = ax.pie(
    sizes, labels=None, colors=colors, explode=explode,
    autopct='%1.0f%%', startangle=140,
    pctdistance=0.75, wedgeprops=dict(edgecolor='white', linewidth=2)
)
for at in autotexts:
    at.set_fontsize(11)
    at.set_color('white')
    at.set_fontweight('bold')

legend_patches = [mpatches.Patch(color=colors[i], label=f"{labels[i]} – {sizes[i]}%")
                  for i in range(len(labels))]
ax.legend(handles=legend_patches, loc='lower center', bbox_to_anchor=(0.5, -0.12),
          ncol=2, frameon=False, fontsize=11)

ax.set_title('Robo-Advisor Portfolio Allocation', fontsize=15, fontweight='bold',
             color='#222222', pad=20)
plt.tight_layout()
plt.savefig(os.path.join(out, '06_portfolio_allocation.png'), dpi=180,
            bbox_inches='tight', facecolor='white')
plt.close()
print("Saved: 06_portfolio_allocation.png")


# ─────────────────────────────────────────────────────────────
# DIAGRAM 7 – Personalized Recommendation System
# ─────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(13, 5), facecolor='white')
ax.set_xlim(0, 13)
ax.set_ylim(0, 5)
ax.axis('off')

boxes = [
    (0.3,  1.5, 2.2, 2.0, '#D6EAF8', 'User Data',          'Search History\nWatchlist\nRisk Profile\nPast Trades'),
    (3.2,  1.5, 2.2, 2.0, '#E8F8F5', 'Feature\nEngineering','Preprocessing\n& Normalization'),
    (6.1,  1.5, 2.2, 2.0, '#F4ECF7', 'ML Model',           'Collaborative\nFiltering /\nContent-Based'),
    (9.0,  1.5, 2.2, 2.0, '#FEF9E7', 'Ranked\nStock List', 'Scored &\nFiltered Results'),
    (11.5, 1.5, 1.2, 2.0, '#E9F7EF', 'Output',             'INFY\nTCS\nHDFC\nRELIANCE'),
]

for (x, y, w, h, color, title, subtitle) in boxes:
    rect = mpatches.FancyBboxPatch((x, y), w, h,
                                   boxstyle="round,pad=0.08",
                                   facecolor=color, edgecolor='#AAAAAA',
                                   linewidth=1.2)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h - 0.32, title, ha='center', va='top',
            fontsize=10, fontweight='bold', color='#222222')
    ax.text(x + w/2, y + h/2 - 0.1, subtitle, ha='center', va='center',
            fontsize=8, color='#555555', linespacing=1.4)

# Arrows
arrow_props = dict(arrowstyle='->', color='#555555', lw=1.5)
xs = [b[0] + b[2] for b in boxes[:-1]]
for i, x in enumerate(xs):
    ax.annotate('', xy=(boxes[i+1][0], 2.5), xytext=(x, 2.5),
                arrowprops=arrow_props)

ax.set_title('Personalized Stock Recommendation System',
             fontsize=14, fontweight='bold', color='#222222', pad=14)
plt.tight_layout()
plt.savefig(os.path.join(out, '07_recommendation_system.png'), dpi=180,
            bbox_inches='tight', facecolor='white')
plt.close()
print("Saved: 07_recommendation_system.png")
print("All done!")
