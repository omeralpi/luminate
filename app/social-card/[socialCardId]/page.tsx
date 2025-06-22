import { appConfig } from '@/config/app';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface SocialCardPageProps {
    params: {
        socialCardId: string;
    };
}

export async function generateMetadata({ params }: SocialCardPageProps): Promise<Metadata> {
    const socialCard = await db.query.socialCards.findFirst({
        where: (socialCards, { eq }) => eq(socialCards.id, parseInt(params.socialCardId)),
    });

    if (!socialCard) {
        return {
            title: 'Social Card Not Found - LuminATE',
            description: 'The requested social card could not be found',
        };
    }

    const imageUrl = `${appConfig.siteUrl}/api/image?content=${encodeURIComponent(socialCard.content)}`;

    return {
        title: 'Social Card - LuminATE',
        description: socialCard.content.substring(0, 160) + '...',
        openGraph: {
            title: 'Social Card - LuminATE',
            description: socialCard.content.substring(0, 160) + '...',
            type: 'website',
            url: `${appConfig.siteUrl}/social-card/${params.socialCardId}`,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: 'LuminATE Social Card',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Social Card - LuminATE',
            description: socialCard.content.substring(0, 160) + '...',
            images: [imageUrl],
        },
    };
}

export default async function Page({ params }: SocialCardPageProps) {
    const socialCard = await db.query.socialCards.findFirst({
        where: (socialCards, { eq }) => eq(socialCards.id, parseInt(params.socialCardId)),
    });

    if (!socialCard) {
        notFound();
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <img src={`/api/image?content=${encodeURIComponent(socialCard.content)}`} alt="social-card" />
        </div>
    );
}