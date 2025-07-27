import { Dashboard } from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { SharePage } from "./pages/SharePage";
const App = () => {
  return <BrowserRouter>
      <Routes>
          <Route path="/signup"element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path = "/share/:shareId" element={<SharePage/>} />
      </Routes>
  </BrowserRouter>
   
}
export default App;