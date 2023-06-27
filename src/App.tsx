import "./App.css";
import { SignIn } from "./components/SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.ts";
import { ToDoWrapper } from "./components/ToDoWrapper";

function App() {
  const [user] = useAuthState(auth);
  return <>{user ? <ToDoWrapper /> : <SignIn />}</>;
}

export default App;
