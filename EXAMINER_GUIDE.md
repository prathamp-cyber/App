# EXAMINER GUIDE: G-INTERIOR MOBILE APP
## Project Structure, Code Explanations, and Key Concepts

This document is a comprehensive, beginner-friendly guide written in a mix of clear English and Hindi (Hinglish). It explains exactly how every file, feature, and component in the **G-Interior App** works, why it was implemented that way, and how it performs efficiently. Use this to confidently answer any question your project examiner asks!

---

## SECTION 1: GLOBAL CONFIGURATIONS & ENTRY POINT

### 1. package.json & app.json
- **What are they?**
  - **`package.json`**: This is the configuration file for Node.js/npm. It contains the list of all packages (libraries) the app uses (dependencies), such as `expo`, `react-native`, `@expo/vector-icons`, and `expo-router`.
  - **`app.json`**: This is the configuration file for **Expo**. It specifies the app's display name ("Gandhidham Interior Design Directory"), version, icon, splash screen settings, and target SDK version (SDK 54).
- **Hindi Explanation**: 
  - `package.json` hamare app ki 'ingredients list' (materials/packages) hai. Isse local system ko pata chalta hai ki kaun-se software tools compile karne ke liye install karne hain.
  - `app.json` hamare app ki settings profile hai. Mobile phone mein jab app install hoga, to uska icon kya hoga, name kya display hoga, aur loading screen kaisa dikhega, ye sab isme likha hota hai.
- **Examiner Tip**: If the examiner asks, *"Why did you use Expo SDK 54?"*, you can answer: *"We downgraded and pinned the project to Expo SDK 54 to match the physical device version of Expo Go (54.0.8) running on our testing phone. This prevents SDK mismatch errors."*

### 2. tsconfig.json
- **What is it?**
  - Configures **TypeScript** parameters (strictness, path aliases like `@/components/*` mapping to `src/components/*`).
- **Hindi Explanation**: 
  - Ye TypeScript compiler ki settings file hai. Ye ensure karti hai ki hum jo rules set karein (jaise strict type checking), developer usi standard ko follow kare taaki runtime pe crashes na ho.

---

## SECTION 2: ARCHITECTURE & STATE MANAGEMENT

### 1. AppContext.tsx (Path: `src/context/AppContext.tsx`)
- **What is it?**
  - This file implements **React Context API**. It behaves like a **global database** for the app.
  - It holds three main states that need to be shared across multiple screens:
    1. `city`: The currently selected city ("Gandhidham" or "Ahmedabad").
    2. `savedIds`: A list of interior designer IDs that the user has bookmarked (Saved list).
    3. `comparedIds`: A list of designer IDs (maximum of 3) selected for side-by-side comparison.
- **Key Functions**:
  - `toggleSave(id)`: Adds the designer to favorites if not already present; removes it if they are already saved.
  - `toggleCompare(id)`: Handles adding/removing designers from the comparison slot, enforcing the **limit of 3 designers maximum** (with an alert).
- **Hindi Explanation**: 
  - Jab hum kisi designer ko tab 1 (Explore) mein favorite mark karte hain, toh tab 3 (Saved) mein wo automatic dikh jata hai. Ye aapas mein communication is `AppContext` ki wajah se hota hai.
  - React mein variables standard tarike se parent se child mein pass hote hain (props drilling). Par agar multi-screen app ho, toh hum ek "Global State Container" bana dete hain jisse koi bhi page direct data nikal ya badal sake.
- **Examiner Tip**: *"Why did you use Context instead of Redux?"* -> *"For an application of this scale, Context API is lightweight, built directly into React, requires zero external libraries, and provides excellent performance without boilerplate code."*

### 2. use-theme.ts (Path: `src/hooks/use-theme.ts`)
- **What is it?**
  - A custom React Hook that provides the styling guidelines (Colors) of the app based on the active scheme.
- **Hindi Explanation**: 
  - Humne direct raw colors (red, blue) code mein likhne ki jagah ek theme hook banaya hai. Ye hook humein pure white background (`#FFFFFF`), earthy **Brown** (`#8D5B4C`), aur biophilic **Dark Green** (`#1E3F20`) components ko call karne ki functional safety deta hai.

---

## SECTION 3: DIRECTORY DATA (mockData.ts)

### Path: `src/constants/mockData.ts`
- **What is it?**
  - This file holds the **real data** of the interior designers in Gandhidham and Ahmedabad.
  - Includes real firms like **Designer's Circle** (Rajesh Sheth), **Sthapatya** (Amit Patel), **The Grid Architects** (Snehal Suthar), **Modo Design** (Arpan Shah), etc.
  - Details stored for each designer: area, rating, completed projects, experience, email, response time, Google review counts, and customer ratings metrics (communication, versatility, timeliness, professionalism).
  - Prices are **intentionally excluded** because in the real industry, interior design pricing is highly customized based on scope, space layout, materials, and personal client consultation.
- **Hindi Explanation**: 
  - Is file mein Ahmedabad aur Gandhidham ke real designers ki complete data dictionary banayi hai. Google Reviews ke ratings aur real survey parameters ko structure kiya hai.
  - Prices ko isme nahi rakha hai kyunki pricing fixed nahi hoti, balki area size, client preferences, aur materials par decide hoti hai (factors based calculation).

---

## SECTION 4: ROUTING & NAVIGATION (src/app/)

Expo Router uses **file-based routing** inside the `src/app` directory. The structure of files defines the tabs and navigation stack.

### 1. _layout.tsx (The Wrapper)
- **What is it?**
  - The main container that boots the application. It wraps the app inside the `AppProvider` (our context) and sets up the **Bottom Tab Navigation**.
  - Configures the titles, active colors (`tabBarActiveTintColor`), styles (height, background color), and icon indicators.
  - It uses **Ionicons** from `@expo/vector-icons` to show clean tab icons (`compass` for Explore, `git-compare` for Compare, `heart` for Saved) on both Android and iOS devices.
- **Hindi Explanation**: 
  - Ye layout file app ka structural frame hai. Ye screen ke niche jo 3 navigation tabs hote hain (Explore, Compare, Saved) unhe draw karti hai aur unpe icons/labels lagati hai.
  - Isme humne `@expo/vector-icons` se `Ionicons` use kiye hain jo Android aur iOS dono platform pe automatically bina crash hue chalte hain.

### 2. index.tsx (The Explore Screen)
- **What is it?**
  - The home/explore screen matching your wireframe concept.
  - **Upper half**: Displays "Editor's Top Choice" (Featured Designer) with a large card, rating stars, and details.
  - **Location Header**: Has a dropdown trigger. Tapping it lets you switch between **Gandhidham** and **Ahmedabad**.
  - **Middle section**: Horizontal scroll chip list for area filters (e.g. Satellite, SG Highway, Sector 1A, Adipur).
  - **Lower half**: Scrollable vertical list of all interior designers based on the selected city and filters.
  - **Search functionality**: Real-time filtering as you type.
- **Hindi Explanation**: 
  - Ye main home page hai. Sabse upar location switcher hai jo state badalte hi complete details Ahmedabad ya Gandhidham mein swap kar deta hai.
  - Beech mein area filter chips hain jo tab update karte hain jab aap alag-alag areas select karte hain.
  - Niche scrollable list designer profiles load karti hai. Humne clean real-time search lagaya hai jo dynamic filtering use karta hai.

### 3. compare.tsx (The Comparison Screen)
- **What is it?**
  - Renders a side-by-side comparison table of the selected designers (maximum of 3).
  - It pulls the designer metrics from `AppContext` and lists their experience, completed projects, response speed, location area, specialties, and customer survey parameters side-by-side.
  - If no designers are selected, it displays a neat "Empty State" message instructing the user to select designers from the Explore tab.
- **Hindi Explanation**: 
  - Jab client 2 ya 3 designers select karta hai aur is tab pe aata hai, toh use aamne-saamne unka scale dekhne ko milta hai (e.g. kiska response time best hai, kiski rating zyada hai).
  - Humne layout ko modern table row structure mein align kiya hai jo horizontal scroll support karta hai taaki grid cleanly display ho.

### 4. saved.tsx (The Saved Screen)
- **What is it?**
  - Lists all designers bookmarked by the user.
  - Reads `savedIds` from the context, filters the designer array, and renders them. If empty, shows a heart icon placeholder.
- **Hindi Explanation**: 
  - Jis designer ko bhi aap save button dabakar favorite list mein add karte hain, ye screen context se unki ID check karke user ko custom portfolio showcase dikhati hai.

---

## SECTION 5: COMPONENTS (Reusable Blocks)

Creating separate components ensures **clean code modularity** and high efficiency.

### 1. designer-card.tsx
- **What is it?**
  - The visual list card shown on the Explore and Saved screens.
  - It showcases the designer's cover photo, profile avatar, firm name, star rating badge, location tags, specialties, a checkbox to add to comparison, and a heart button to save/bookmark.
- **Hindi Explanation**: 
  - Explore page par jo ek single designer ka box (rectanglar card) dikhta hai, ye uski modular blueprint file hai. Iske andar hum direct props pass karte hain aur ye card construct ho jata hai.
  - Isse hamare explore page ka code chota aur easily readable rehta hai.

### 2. designer-detail-modal.tsx
- **What is it?**
  - A comprehensive slide-up profile overlay triggered when you tap any designer card.
  - Displays:
    1. High-resolution portfolio galleries.
    2. Details about the firm, location address, and experience.
    3. **Verified Survey Metrics**: Radar-like performance scores (e.g. communication, timeliness out of 5 stars) gathered from google surveys.
    4. **Google Reviews**: List of authentic reviews with dates and comments.
    5. **"Book Free Consultation" Form**: An overlay form where the user input fields (name, email, date) are validated, showing a "Request Sent" checkmark animation.
- **Hindi Explanation**: 
  - Ye detailed profile modal hai. Jab user kisi card pe click karta hai, toh niche se ye page upar aata hai. Isme full review data aur contact input form hai.
  - Consultation Form mein state changes handling hai. Submit button dabane par animation show hoti hai aur response trigger simulate hota hai.

### 3. animated-icon.tsx
- **What is it?**
  - Implements the custom entry screen loader. It uses `react-native-reanimated` to smoothly fade out the logo and loading state once the app finishes booting.
- **Hindi Explanation**: 
  - Jab app pehli baar open hota hai, to ek sleek loading/splash screen user-experience badhane ke liye show hota hai, jo initialization ke baad fade-out ho jata hai.

---

## SECTION 6: HOW CODE RUNS EFFICIENTLY (Optimization Details)

If the examiner asks: *"What makes your React Native code efficient?"*, explain these three mechanisms:

1. **State Filtering on Render**:
   In `index.tsx`, designers are filtered dynamically:
   ```javascript
   const filteredDesigners = MOCK_DESIGNERS.filter((designer) => { ... })
   ```
   Instead of running multiple state setters, the array filters inline during render, keeping the UI smooth and responsive at 60 FPS.
2. **Context API instead of Props Drilling**:
   Global operations (saving, comparing) take place in a single wrapper. Screens don't pass variables between each other; they access the single source of truth directly.
3. **FlatList and Image Optimization**:
   The app uses lazy image rendering, which reduces memory consumption on physical mobile devices by loading portfolio assets dynamically instead of pre-caching large files all at once.
