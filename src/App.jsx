import { BrowserRouter } from "react-router-dom";
import AuthRoutes from "./routes/authRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
}

export default App;
