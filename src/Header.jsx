import logo from './assets/logo.svg';
import { Link } from 'react-router-dom';
export default function Header() {
    return (
        <header className="">
            <img
                src={logo}
                className="w-25 h-10 md:w-45 md:h-30 lg:w-65 lg:h-50"
                alt="logo"
            />
            <div className="flex gap-6">
                <Link to="/exam">Exams</Link>
                <Link to="/lectures">Lectures</Link>
                <Link to="/contact">Contact</Link>
            </div>
        </header>
    );
}
