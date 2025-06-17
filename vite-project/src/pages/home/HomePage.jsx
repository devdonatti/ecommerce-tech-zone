import Category from "../../components/category/Category";
import HeroSection from "../../components/heroSection/HeroSection";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";

import Track from "../../components/track/Track";

const HomePage = () => {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden w-full">
      <Layout>
        <Category />
        <HeroSection />
        <HomePageProductCard />
        <Track />
      </Layout>
    </div>
  );
};

export default HomePage;
