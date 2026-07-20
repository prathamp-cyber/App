# 📘 Dwellist Codebase Explainer & Developer Handbook

Welcome! This document is designed to walk your team, friends, and new developers through the **Dwellist** app codebase from scratch. It goes from basic concepts to complex architecture and UI rendering flows.

---

## 🗺️ 1. Codebase Architecture & Directory Structure

Dwellist is a universal **React Native Expo** application that compiles to Android, iOS, and Web. It uses the file-system router (`expo-router`) for navigation.

Here is the high-level map of the codebase:

```
OUR APP/
├── package.json                   # App dependencies and run scripts
├── app.json                       # Expo configuration (app name, icons, plugins)
├── scripts/
│   ├── reset-project.js           # Helper script to clean up starter templates
│   └── diagnose-network.js        # Network IP diagnostics (added by Antigravity)
└── src/                           # Main Application Source Code
    ├── app/                       # Expo Router Screens (URL/Navigation mapping)
    │   ├── _layout.tsx            # Main application layout, theme provider, and tabs
    │   ├── index.tsx              # Explore Page (search, city, area filters)
    │   ├── saved.tsx              # Saved Designers list
    │   └── compare.tsx            # Side-by-side comparison page (complex layout)
    ├── components/                # Reusable UI Components
    │   ├── designer-card.tsx      # Card UI item representing a studio
    │   ├── designer-detail-modal.tsx # Portfolio view modal for single designer
    │   ├── themed-text.tsx        # Typography helper implementing dark/light text
    │   └── themed-view.tsx        # Visual container responding to themes
    ├── constants/                 # Mock Data and Colors
    │   ├── mockData.ts            # Studio datasets, details, photos, and ratings
    │   └── theme.ts               # Core Design token definitions (Spacings, Insets, Palette)
    ├── context/                   # Global State Managers
    │   └── AppContext.tsx         # User state (Saved designers, Comparison items, City selection)
    └── hooks/                     # Custom React Hooks
        └── use-theme.ts           # Accesses active theme styling properties
```

---

## ⚡ 2. The Core State Engine (`AppContext.tsx`)

At the center of all dynamic actions is the **React Context API** (`src/context/AppContext.tsx`). It provides global states that persist across tab switching.

### Key Features Explained:
1. **Saved list:** Allows users to bookmark design studios.
2. **Comparison shelf:** Allows users to pick up to **3** studios to inspect side-by-side.
3. **Current City selection:** Filters all studios instantly between **Gandhidham** and **Ahmedabad**.

### Code Breakdown:
* **The Interface definition:**
  ```typescript
  interface AppContextType {
    savedIds: string[];
    comparedIds: string[];
    toggleSave: (id: string) => void;
    toggleCompare: (id: string) => void;
    clearCompare: () => void;
    city: string;
    setCity: (city: string) => void;
  }
  ```
* **Comparison Limit Guard Logic:**
  ```typescript
  const toggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Remove if already compared
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 designers at a time.");
          return prev; // Reject addition if already comparing 3 items
        }
        return [...prev, id]; // Add to comparison list
      }
    });
  };
  ```

---

## 🎨 3. Design Token & Theme System (`theme.ts`, `use-theme.ts`)

Instead of hardcoding colors, Dwellist uses a theme system built on top of React Native's styles.
* **Palette (`constants/theme.ts`):** Defines warm organic greens (`#1B4332`), earth browns (`#8C6A5C`), backgrounds, and text states.
* **Custom Hook (`hooks/use-theme.ts`):** Accesses color objects directly based on current appearance (Dark/Light).

---

## 🖥️ 4. Screen-by-Screen Breakdown & Logic Flows

### 📍 A. Explore Screen (`src/app/index.tsx`)
This is the homepage of Dwellist. It manages:
* **City Selection Dialog:** Triggers a popup modal. When a city changes, a `useEffect` resets active search queries and area chips to keep state clean.
* **Complex Filtering Logic:**
  ```typescript
  const filteredDesigners = MOCK_DESIGNERS.filter((designer) => {
    const matchesCity = designer.city === city;
    const matchesArea = selectedArea === 'All Areas' || designer.area === selectedArea;
    const matchesSearch =
      designer.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.specialties.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCity && matchesArea && matchesSearch;
  });
  ```
* **Editor's Top Choice:** Prominently highlights a specific designer profile depending on the selected city (e.g., *Designer's Circle* for Gandhidham or *The Grid Architects* for Ahmedabad).

---

### 📑 B. Side-by-Side Comparison Screen (`src/app/compare.tsx`)
This is the most complex UI logic in the app. It renders a structured comparison grid.

```
       Table Structure
┌──────────────┬──────────────────┬──────────────────┐
│  Attribute   │ Studio A (Image) │ Studio B (Image) │
├──────────────┼──────────────────┼──────────────────┤
│ Experience   │ 12 Years         │ 8 Years          │
├──────────────┼──────────────────┼──────────────────┤
│ Design Style │ Modern Minimal   │ Brutalist/Raw    │
└──────────────┴──────────────────┴──────────────────┘
```

#### Key Implementation Strategies:
1. **Double ScrollView Setup:**
   * Outer Horizontal ScrollView: Allows swiping left-to-right to review studios.
   * Inner Vertical ScrollView: Locks rows vertically so headers align perfectly with details.
2. **Fixed Column Labels:**
   The leftmost cell in every row holds a label (e.g., "Experience", "Projects Done", "Cost Estimate"), while subsequent columns are mapped dynamically:
   ```typescript
   {comparedDesigners.map((designer) => (
     <View key={designer.id} style={styles.designerCol}>
       <ThemedText>{designer.experience} Years</ThemedText>
     </View>
   ))}
   ```

---

### 💾 C. Saved Studios (`src/app/saved.tsx`)
This screen connects directly to the `savedIds` list in the global `AppContext`. It filters the `MOCK_DESIGNERS` array:
```typescript
const savedDesigners = MOCK_DESIGNERS.filter((d) => savedIds.includes(d.id));
```
It displays an interactive clean list and has a prompt to guide the user back to the Explore page if no bookmarks are added.

---

## 🛠️ 5. Development Connection Troubleshooting

If you or your friends encounter connection issues scanning the Metro Server QR code on a mobile phone (often caused by Windows firewall blockages or VM network conflicts):

1. **Start Server with Tunnel:**
   ```bash
   npm run tunnel
   ```
   *Creates a public endpoint using ngrok, bypassing all local routing blocks.*

2. **Diagnose network adapters:**
   ```bash
   npm run diagnose
   ```
   *Detects whether your system is binding Expo to virtual network cards (like VMware or VirtualBox) instead of your physical Wi-Fi IP.*
