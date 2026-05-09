
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Addproducts from './components/Addproducts';
import Getproducts from './components/Getproducts';
import Makepayment from './components/Makepayment';
import { BrowserRouter,Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter >
    <div className="App">

     <header className="custom-navbar sticky-top">
  <div className="container-fluid d-flex flex-wrap justify-content-between align-items-start">
    {/* Logo Section */}
    <Link to="/" className="text-decoration-none logo-text">
      <span className="fw-light">XP-</span><span className="fw-bold">Bird</span>
    </Link>

    {/* Navigation Links */}
    <ul className="nav nav-pills align-items-center">
      <li className="nav-item">
        <Link to="/products" className="nav-link nav-custom-link">Shop</Link>
      </li>
      <li className="nav-item">
        <Link to="/addproduct" className="nav-link nav-custom-link">Introduce merchandise</Link>
      </li>
      <li className="nav-item ms-4">
        <Link to="/signin" className="nav-link sign-in-btn">Sign In</Link>
      </li>
      <li className="nav-item ms-2">
        <Link to="/signup" className="nav-link get-started-btn">Get Started</Link>
      </li>
    </ul>
  </div>
</header>
      <Routes>
        <Route path='/signup' element={ <Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/addproduct' element={<Addproducts/>}/>
        <Route path='/' element={<Getproducts/>}/>
        <Route path='/makepayment' element={<Makepayment/>}/>


     
      
      
      
      
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
