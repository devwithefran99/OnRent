import Categories from "@/components/home/Categories";
import CustomerReviews from "@/components/home/customer-reviews";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PopularEquipment from "@/components/home/PopularEquipment";
import WhyChooseUs from "@/components/home/why-us";

export default function Page() {
  return (
    <main>
      <Hero />
      <FeaturedEquipment />
      <Categories />
      <WhyChooseUs />
      <HowItWorks />
      <PopularEquipment />
      <CustomerReviews />
    </main>
  );
}
