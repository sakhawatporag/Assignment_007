import Nav from '@/components/Nav';
import Banner from'@/components/Banner';
import Footer from'@/components/Footer';



const page = () => {
  return (
    <>
      <main className="min-h-screen bg-[#f7fcf8]">
        <Nav />
        <div className="bg-[#f7fcf8]">
          <Banner />
        </div>
        <Footer />

       
      </main>

      







    </>
  );
};

export default page;