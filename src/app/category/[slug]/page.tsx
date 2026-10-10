import MiniNavDetails from '@/components/Mini_nav_details';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <MiniNavDetails slug={slug} />;
}
