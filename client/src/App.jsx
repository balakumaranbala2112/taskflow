import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { restoreSession } from "./services/authSession";

function App() {
  useEffect(() => {
    restoreSession()
  }, [])
  return (
    <AppRoutes />
  );
}

export default App;