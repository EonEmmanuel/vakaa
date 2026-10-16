"use client"

import {useState} from 'react';
import {useRouter} from '@/platform/i18n/navigation';
import {useTranslations} from 'next-intl';
import {Search} from 'lucide-react';
import {InputGroup, InputGroupAddon} from '@/components/ui/input-group';
import {Input} from '@/components/ui/input';

export function SearchInputForm({ initialTerm }: { initialTerm: string }) {
    const [term, setTerm] = useState(initialTerm);
    const router = useRouter();
    const t = useTranslations('Search');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            router.push(`/search?q=${encodeURIComponent(term.trim())}`);
        } else {
            router.push('/search');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto relative group">
            <InputGroup className="h-12 sm:h-14 rounded-2xl border-[#e2ddd2] bg-[#fbfaf7] hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 *:data-[slot=input-group-addon]:pl-4">
                <InputGroupAddon>
                    <Search className="size-5 sm:size-6 text-[#D4A43C] transition-colors" />
                </InputGroupAddon>
                <Input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-transparent border-none focus-visible:ring-0 text-[#1c1b18] text-base sm:text-lg placeholder:text-[#7d796f] h-full"
                />
            </InputGroup>
        </form>
    );
}
