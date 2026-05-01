import Header from './Header.jsx';
import Exam from './Exam';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
export default function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/exam" element={<Exam />} />
            </Routes>
        </BrowserRouter>
    );
}
