import Nav from '@/components/Nav';
import Banner from'@/components/Banner';
import Footer from'@/components/Footer';
import Stripe from '@/components/Stripe';
import ProductGrid from '@/components/Product_card';
import NavMini from '@/components/Nav_mini';




const page = () => {
  return (
    <>
      <main className="min-h-screen bg-[#f7fcf8]">
        <Nav />
        <NavMini />
        <Stripe />
        <div className="bg-[#f7fcf8]">
         
          <Banner />
           
          <ProductGrid />
          
        </div>
        <Footer />

       
      </main>

      







    </>
  );
};

export default page;