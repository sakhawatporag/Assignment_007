import Nav from '@/components/Nav';
import Banner from'@/components/Banner';
import Footer from'@/components/Footer';
import Stripe from '@/components/Stripe';



const page = () => {
  return (
    <>
      <main className="min-h-screen bg-[#f7fcf8]">
        <Nav />
        <Stripe />
        <div className="bg-[#f7fcf8]">
          <Banner />
        </div>
        <Footer />

       
      </main>

      







    </>
  );
};

export default page;