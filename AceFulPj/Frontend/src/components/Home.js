import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

function Home() {
    return (
        <div>
            <div id="home">
                <Hero />
            </div>
            <div id="features">
                <Features />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
