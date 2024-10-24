import * as React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './utils/store';
import Home from './components/home';
import SignIn from './components/auth/signin';
import Signup from './components/auth/signup';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/signin",
      element: <SignIn/>,
    },
    {
      path: "/signup",
      element: <Signup/>,
    },
  ]);
  return (
    <div className="App">
          <Provider store={store} >

         <RouterProvider router={router} />
         </Provider>
    </div>
  );
}

export default App;
