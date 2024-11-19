import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';
import Categories from './components/Categories';

const LandingPage = () => {
    return (
        <div className="app">
            <Header />
            <Banner />
            <Categories />
            <Footer />
        </div>
    );
};

export default LandingPage;