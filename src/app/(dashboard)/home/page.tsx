import { QuickCreate } from '@/components/posts/quick-create';

export default function HomePage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20">
            <QuickCreate />
        </div>
    );
}
