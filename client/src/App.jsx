import "./App.css";
import { UserProvider } from "./context/UserContext";
import { UsersProvider } from "./context/UsersContext";
import Home from "./pages/Home/Home";

function App() {
  return (
    <div className="container">
      <UsersProvider>
        <UserProvider>
          <Home />;
        </UserProvider>
      </UsersProvider>
    </div>
  );
}

export default App;
