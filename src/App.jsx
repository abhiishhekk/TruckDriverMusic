import Home from "./pages/Home.jsx";

// App stays a thin shell on purpose — if you add routing later
// (react-router, like your Complaint Tracking System client),
// this is where <Routes> would live instead of rendering <Home /> directly.
export default function App() {
  return <Home />;
}
