# WaitLess Frontend - Visual & Feature Guide

## 🏠 Home Page Layout

```
┌─────────────────────────────────────────────┐
│         ⏱️ Welcome to WaitLess              │
│  Eliminate long queues with real-time      │
│        token management                     │
└─────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┐
│      👤 Customer     │      🏪 Owner        │
│      Portal          │      Dashboard       │
│                      │                      │
│  Get your token and  │  Manage your queue   │
│  track your position │  and serve customers │
│                      │                      │
│  [Queue ID Input]    │  [Queue ID Input]    │
│  [Enter Button]      │  [Enter Button]      │
└──────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────┐
│              ✨ Features                    │
│  🎫 Instant Tokens | ⚡ Real-time | 📱 Mobile│
└─────────────────────────────────────────────┘
```

## 👤 Customer Portal Flow

```
[HOME] → [GET QUEUE ID] → [CUSTOMER PAGE]
           queue-001          /customer/queue-001

BEFORE GETTING TOKEN:
┌─────────────────────────────────┐
│        ⏱️ WaitLess              │
│   Welcome to Coffee Corner      │
│                                 │
│   Tap to get your place in      │
│   the queue                     │
│                                 │
│      [GET TOKEN Button]         │
└─────────────────────────────────┘


AFTER GETTING TOKEN:
┌─────────────────────────────────┐
│        ⏱️ WaitLess              │
│   Welcome to Coffee Corner      │
│                                 │
│      Your Token: #12            │
│                                 │
│  ┌──────────────────────────┐   │
│  │  Currently Serving: #10  │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──────────────────────────┐   │
│  │  Estimated Wait: 2 min   │   │
│  └──────────────────────────┘   │
│                                 │
│     [LEAVE QUEUE Button]        │
│                                 │
│     Queue ID: queue-001         │
└─────────────────────────────────┘

⏰ Auto-refreshes every 5 seconds
```

## 🏪 Owner Dashboard Flow

```
[HOME] → [GET QUEUE ID] → [OWNER PAGE]
          queue-001          /owner/queue-001

┌───────────────────────────────────────┐
│      Owner Dashboard                  │
│   Managing Coffee Corner              │
└───────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│Current Token │ Next Token   │   Waiting    │
│              │              │              │
│     #10      │     #11      │     8        │
│ Being Served │   Up Next    │  In Queue    │
└──────────────┴──────────────┴──────────────┘

┌───────────────────────────────────────┐
│                                       │
│     ➡️ NEXT CUSTOMER Button           │
│                                       │
│   (Increments current token)          │
│                                       │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│   Queue Statistics                    │
│                                       │
│  Current Serving -------- #10         │
│  Next in Queue ---------- #11         │
│  People Waiting --------- 8 people    │
│                                       │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│     Queue ID: queue-001               │
└───────────────────────────────────────┘

⏰ Updates every 10 seconds
```

## 🎨 Component Hierarchy

```
App (Router)
├── Navbar
│   ├── Logo (Link to Home)
│   └── Dark Mode Toggle
│
└── Routes
    ├── Home Page
    │   ├── Hero Card
    │   ├── Customer Portal Card
    │   │   └── Input + Button
    │   ├── Owner Dashboard Card
    │   │   └── Input + Button
    │   ├── Features Section
    │   └── Footer
    │
    ├── Customer Page
    │   ├── Main Card
    │   │   ├── Logo
    │   │   ├── Shop Name
    │   │   ├── Token Display (conditional)
    │   │   │   ├── Get Token Button
    │   │   │   └── Token Stats (after join)
    │   │   │       ├── Your Token
    │   │   │       ├── Current Token
    │   │   │       ├── Estimated Wait
    │   │   │       └── Leave Queue Button
    │   │   └── Queue ID Info
    │   └── Auto-refresh (5s interval)
    │
    └── Owner Page
        ├── Header Card
        ├── Stats Grid
        │   ├── Current Token Card
        │   ├── Next Token Card
        │   └── Waiting Count Card
        ├── Next Customer Button
        ├── Statistics Card
        │   ├── Current Serving
        │   ├── Next in Queue
        │   └── People Waiting
        ├── Queue ID Info
        └── Auto-update (10s interval)
```

## 🎨 Color Scheme

```
LIGHT MODE:
─────────────────────────
Background:     #FFFFFF (white)
Text:           #1F2937 (dark gray)
Cards:          #F8FAFB (light gray)
Primary (Blue): #2563EB
Secondary:      #9333EA (purple)
Success:        #16A34A (green)
Warning:        #EA580C (orange)
Danger:         #DC2626 (red)
Borders:        #E5E7EB (light gray)

DARK MODE:
─────────────────────────
Background:     #111827 (very dark)
Cards:          #1F2937 (dark gray)
Text:           #FFFFFF (white)
Text (muted):   #D1D5DB (light gray)
Primary (Blue): #3B82F6 (lighter blue)
Secondary:      #A855F7 (lighter purple)
Success:        #22C55E (lighter green)
Warning:        #F97316 (lighter orange)
Danger:         #EF4444 (lighter red)
```

## 📊 Data Flow Diagram

### Customer Portal
```
[Home Page]
    ↓
[Input Queue ID]
    ↓
[Customer Page /customer/{queueId}]
    ↓
[useState hooks initialized]
├── myToken: null
├── currentToken: 10
└── estimatedWait: 0
    ↓
[User clicks "Get Token"]
    ↓
[setMyToken(newToken)]
├── myToken = 12 (random)
├── currentToken = 10
└── estimatedWait = 2
    ↓
[setInterval triggers every 5 seconds]
    ↓
[currentToken increments randomly]
├── myToken = 12
├── currentToken = 11 (or stays 10)
└── estimatedWait = 1 (or 2)
    ↓
[Component re-renders with new values]
    ↓
[Display updates automatically]
```

### Owner Dashboard
```
[Home Page]
    ↓
[Input Queue ID]
    ↓
[Owner Page /owner/{queueId}]
    ↓
[useState hooks initialized]
├── currentToken: 10
├── nextToken: 11
└── waitingCustomers: 8
    ↓
[Two types of updates]
│
├─ Manual: Click "Next Customer"
│  ├── setCurrentToken(11)
│  ├── setNextToken(12)
│  └── setWaitingCustomers(7)
│
└─ Automatic: setInterval every 10s
   └── waitingCustomers random ±1
```

## ⌚ Timing Flows

### Customer Page (5-second cycle)
```
t=0s   : User gets token #12
         Current: #10
         Wait: 2 min

t=5s   : Update check
         Current: #10 (70% no change, 30% increment)
         Wait: Recalculate

t=10s  : Update check
         Current: #11 (maybe)
         Wait: Update

t=15s  : Update check
         ... continues
```

### Owner Page (10-second cycle)
```
t=0s   : Initial state
         Current: #10, Next: #11, Waiting: 8

t=10s  : Waiting customers update
         Waiting: 8 → 9 (or 7, or stay 8)

t=20s  : Another update
         Waiting: randomize

User clicks "Next Customer":
         Current: #10 → #11
         Next: #11 → #12
         Waiting: 8 → 7
```

## 📱 Responsive Breakpoints

```
MOBILE (< 768px)
┌─────────────────┐
│ Single Column   │
│ Full Width      │
│ Touch Friendly  │
└─────────────────┘

TABLET (768px - 1024px)
┌──────────┬──────────┐
│ Two Cols │ Two Cols │
└──────────┴──────────┘

DESKTOP (> 1024px)
┌──────┬──────┬──────┐
│Three │Three │Three │
│ Cols │ Cols │ Cols │
└──────┴──────┴──────┘
```

## 🔄 State Updates Timeline

### Customer Journey
```
[1] User lands on /customer/queue-001
    ✓ Page renders with "Get Token" button
    ✓ useEffect starts 5-second interval

[2] User clicks "Get Token"
    ✓ myToken = 12 (random number)
    ✓ Conditional render shows token info

[3] Every 5 seconds
    ✓ currentToken might increment
    ✓ estimatedWait recalculates
    ✓ Component re-renders

[4] User clicks "Leave Queue"
    ✓ myToken = null
    ✓ Resets to initial state

[5] Component unmounts
    ✓ useEffect cleanup clears interval
```

### Owner Journey
```
[1] User lands on /owner/queue-001
    ✓ Page renders with initial stats
    ✓ useEffect starts 10-second interval

[2] User clicks "Next Customer"
    ✓ currentToken + 1
    ✓ nextToken + 1
    ✓ waitingCustomers - 1
    ✓ Immediate visual feedback

[3] Every 10 seconds
    ✓ waitingCustomers change randomly
    ✓ Component re-renders

[4] Component unmounts
    ✓ useEffect cleanup clears interval
```

## 🎯 Interactive Elements

### Buttons
```
[Get Token Button]        [Leave Queue Button]
bg-blue-600             bg-red-600
hover:bg-blue-700       hover:bg-red-700
text-white              text-white
rounded-lg              rounded-lg
px-6 py-3               px-6 py-3
transition              transition
hover:scale-105         (no scale)

[Next Customer Button]   [Enter Portal Buttons]
bg-gradient-to-r        bg-blue-600 / bg-purple-600
from-purple-600         hover:bg-blue-700
to-pink-600             text-white
hover:from-purple-700   rounded-lg
hover:to-pink-700       px-6 py-3
text-white              transition
rounded-lg              hover:scale-105
px-8 py-4
transition
hover:scale-105

[Dark Mode Toggle]
bg-gray-200 dark:bg-gray-700
text-gray-800 dark:text-white
hover:bg-gray-300
rounded-lg
px-4 py-2
transition
```

### Input Fields
```
[Queue ID Input]
border border-gray-300 dark:border-gray-600
bg-white dark:bg-gray-700
text-gray-900 dark:text-white
rounded-lg
px-4 py-2
focus:outline-none
focus:ring-2
focus:ring-blue-500
```

## 📈 Expected Behavior

### Customer Portal Behavior
1. ✅ Page loads with "Get Token" button
2. ✅ Click button → Token appears
3. ✅ Every 5 seconds → Values might change
4. ✅ Estimated wait decreases as current token increments
5. ✅ Leave button resets the state

### Owner Dashboard Behavior
1. ✅ Page loads with all stats
2. ✅ Click "Next Customer" → All values increment
3. ✅ Waiting count decreases by 1
4. ✅ Every 10 seconds → Waiting count changes
5. ✅ Numbers always update in sync

---

**This guide shows the complete visual and functional architecture of WaitLess Frontend.**
