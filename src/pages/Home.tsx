import { useState, useEffect } from 'react';
import {
  LoadingScreen,
  Navbar,
  Hero,
  Experiences,
  Education,
  Projects,
  Skills,
  Certifications,
  Achievements,
  Contact,
  Footer,
} from '../components/public';

const Home = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoading && <LoadingScreen />}
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main>
          <Hero />
          <div className="space-y-0">
            <Experiences />
            <Education />
            <Projects />
            <Skills />
            <Certifications />
            <Achievements />
            <Contact />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
