import { Header } from './cmps/Header';
import { Login } from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import './style/style.scss'
import { Employee } from './pages/Employee';
import { Employer } from './pages/Employer';



function App() {

  return (
    <section>
      <Header />
      <Routes>
        <Route path="/employee" element={<Employee/>} />
        <Route path="employer" element={<Employer/>} />
        <Route path="/" element={<Login/>} />
      </Routes>
    </section>
  );
}

export default App;
