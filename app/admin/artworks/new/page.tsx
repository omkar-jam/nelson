import { ArtworkForm } from '@/components/artwork-form';

export default function NewArtworkPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-12">
      <h1 className="font-display text-display-md font-light text-paper sm:text-display-lg">New artwork</h1>
      <ArtworkForm />
    </main>
  );
}
