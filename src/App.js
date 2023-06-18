import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoGlobal from "./Pages/TodoGlobal/TodoGlobal.js";
import Login from "./Pages/Login/Login.js";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  return (
    <GoogleOAuthProvider  clientId="55313282380-f3hf1vj3e8inssqduc5i644la3v40eog.apps.googleusercontent.com" >
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<TodoGlobal />}/>
          <Route path="/login" element={<Login />}/>
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}


//<Route path="/" element={<TodoGlobal />}/>
