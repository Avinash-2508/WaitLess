# WaitLess - Queue Management System

A minimal, clean React + Tailwind CSS frontend for managing queues in small shops with a simple token system.

## 🎨 Design Philosophy

- **Minimal interface** - No animations, clean and simple
- **Mobile-first** - Responsive on all screen sizes  
- **Focused UI** - Shows only essential information
- **Light color scheme** - Gray/white background with blue primary color

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173/customer/queue-001 or /owner/queue-001
```

## 📱 Pages

### Customer Portal (`/customer/:queueId`)
When a customer scans a QR code, they land here.

**UI:**
- Welcome message with shop name
- If no token: "Get Token" button
- If has token: Shows Your Token, Current Token, and Waiting people count
- "Leave Queue" button to exit

**Behavior:**
- Click "Get Token" to join queue
- Tokens auto-refresh every 5 seconds
- Shows how many people are waiting ahead

### Owner Dashboard (`/owner/:queueId`)
For shop owners to manage the queue.

**UI:**
- Current Token being served
- Next Token in queue
- Number of people waiting
- "Next" button to increment current token

**Behavior:**
- Click "Next" to serve the next customer
- Simple, at-a-glance queue management

## 🏗️ Project Structure

```
src/
├── App.jsx                  (Router setup)
├── pages/
│   ├── Customer.jsx        (Customer portal)
│   └── Owner.jsx           (Owner dashboard)
├── components/
│   └── Navbar.jsx          (Layout with navbar - renamed from Card.jsx)
├── index.css               (Global styles)
└── main.jsx                (Entry point)
```

## 🎨 Design System

### Colors
- **Background:** #f9fafb (gray-50)
- **Text:** #111827 (gray-900)
- **Primary Button:** #2563eb (blue-600) → #1d4ed8 (blue-700) on hover
- **Secondary Button:** border-gray-300 with gray-700 text

### Components
- **Navbar:** White background with shadow, "WaitLess" logo in blue
- **Card:** White background with soft shadow, centered content, max-width 448px
- **Buttons:** 
  - Primary (blue): `bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md`
  - Secondary (outline): `border border-gray-300 text-gray-700 py-2 rounded-md`

## 📊 State Management

Uses React `useState` for simple state:

```javascript
const [currentToken, setCurrentToken] = useState(9);
const [myToken, setMyToken] = useState(null);
```

**Auto-refresh** simulation with `setInterval` every 5 seconds (no backend yet).

## 📱 Responsive Design

- **Mobile-first** approach
- **Full width** on small screens with padding
- **Centered content** using flexbox
- **Touch-friendly** button sizes

## 🔄 Layout Component

All pages use the same Layout wrapper:

```jsx
<Layout>
  <div className="bg-white shadow p-6 w-full max-w-sm rounded-lg text-center space-y-4">
    {/* Page content */}
  </div>
</Layout>
```

The Layout provides:
- Navbar at the top
- Centered main content area
- Gray background (#f9fafb)
- Consistent height calculation

## 🔌 Ready for Backend

Currently uses mock state. To connect to a backend:
1. Replace `useState` calls with API calls
2. Update `setInterval` to fetch real data
3. Add loading/error states

## 📦 Dependencies

- **React 19** - UI framework
- **React Router v6** - Routing
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool

## 🚀 Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint check
```

## 📄 Notes

- No animations - pure, clean UI
- No dark mode - simple light theme
- No charts/graphs - focused on essential info
- No login system - direct access via queue ID in URL

---

Built with ❤️ using React + Tailwind CSS
