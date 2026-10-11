import BazarDetails from '@/components/Bazar-details';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <BazarDetails slug={slug} />;
}
