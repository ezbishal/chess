import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { LandingPage } from "./pages/landingPage";
import { Game } from "./pages/game";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
