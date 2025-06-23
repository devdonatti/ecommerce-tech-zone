import HeroSection from "../../components/heroSection/HeroSection";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";

import Track from "../../components/track/Track";

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen overflow-x-hidden w-full transition-colors duration-300">
      <Layout>
        <HeroSection />
        <Track />
        <HomePageProductCard />
      </Layout>
    </div>
  );
};

export default HomePage;
