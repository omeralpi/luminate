'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";

interface SecretModalProps {
    children: React.ReactNode;
}

export function SecretModal({ children }: SecretModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Secret Modal</DialogTitle>
                </DialogHeader>
                <SecretModalStepper />
            </DialogContent>
        </Dialog>
    );
}

import { Input } from '@/components/ui/input';
import { appConfig } from "@/config/app";
import { SocialCard } from "@/lib/db/schema";
import { trpc } from "@/trpc/client";
import { defineStepper } from '@stepperize/react';
import { Copy, Loader2, Twitter } from "lucide-react";

const { useStepper, utils } = defineStepper(
    {
        id: 'q1',
        title: 'How are you ate?',
        type: 'radio',
        answers: [
            'Ate for living',
            'Living for ate'
        ]
    },
    {
        id: 'q2',
        title: 'What are you?',
        type: 'radio',
        answers: [
            'Creator',
            'User',
            'Viber',
        ]
    },
    {
        id: 'q3',
        title: 'Stellar is ...',
        type: 'text',
    }
);

function SecretModalStepper() {
    const stepper = useStepper();
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [socialCard, setSocialCard] = useState<SocialCard | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleAnswer = (id: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    };

    const { mutate: generateSecret, isPending } = trpc.ai.generateSecret.useMutation({
        onSuccess: (data) => {
            setSocialCard(data);
            setIsImageLoading(true);
        },
    });

    const { mutate: incrementShareCount } = trpc.user.incrementShareCount.useMutation();

    const handleComplete = async () => {
        const validAnswers = Object.fromEntries(
            Object.entries(answers).filter(([, value]) => value !== null)
        ) as Record<string, string>;
        generateSecret({ answers: validAnswers });
    };

    const handleTwitterShare = () => {
        if (!socialCard) return;

        incrementShareCount();

        const shareText = `Hey, I just discovered my secret! 🎉 Create your own secret and see what you get!`;
        const shareUrl = `${appConfig.siteUrl}/social-card/${socialCard.id}`;
        const imageUrl = `${appConfig.siteUrl}/api/image?content=${encodeURIComponent(socialCard.content)}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&image=${imageUrl}`;

        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    const handleCopy = async () => {
        if (!socialCard) return;

        const imageUrl = `/api/image?content=${encodeURIComponent(socialCard.content)}`;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy image:', error);
        }
    };

    const currentIndex = utils.getIndex(stepper.current.id);

    if (socialCard) {
        return (
            <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    )}
                    <img
                        src={`/api/image?content=${encodeURIComponent(socialCard.content)}`}
                        alt="secret"
                        className="h-full w-full object-cover transition-opacity duration-300"
                        onLoad={() => setIsImageLoading(false)}
                        style={{ opacity: isImageLoading ? 0 : 1 }}
                    />
                </div>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={handleTwitterShare}
                        className="flex items-center gap-2"
                        variant="default"
                    >
                        <Twitter className="w-4 h-4" />
                        Share on Twitter
                    </Button>
                    <Button
                        onClick={handleCopy}
                        className="flex items-center gap-2"
                        variant="outline"
                        disabled={isCopied}
                    >
                        <Copy className="w-4 h-4" />
                        {isCopied ? 'Copied!' : 'Copy Image'}
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-6 p-6 border rounded-lg">
            <div className="flex items-center gap-4">
                <StepIndicator
                    currentStep={currentIndex + 1}
                    totalSteps={stepper.all.length}
                />
                <div className="flex flex-col gap-4 flex-1">
                    <h2 className="flex-1 text-lg font-medium">
                        {stepper.current.title}
                    </h2>
                    {stepper.current.type === 'radio' && (
                        <div className="flex flex-col gap-2">
                            {stepper.current.answers.map((answer) => (
                                <Button
                                    variant={
                                        answers[stepper.current.id] === answer
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="w-full"
                                    key={answer}
                                    onClick={() => handleAnswer(stepper.current.id, answer)}
                                >
                                    {answer}
                                </Button>
                            ))}
                        </div>
                    )}
                    {stepper.current.type === 'text' && (
                        <Input
                            value={(answers[stepper.current.id] as string) || ''}
                            onChange={(e) =>
                                handleAnswer(stepper.current.id, e.target.value)
                            }
                        />
                    )}
                </div>
            </div>
            <div className="space-y-4">
                {!stepper.isLast ? (
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="secondary"
                            onClick={stepper.prev}
                            disabled={stepper.isFirst}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={stepper.next}
                            disabled={!answers[stepper.current.id]}
                        >
                            {stepper.isLast ? 'Complete' : 'Next'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-4">
                        <Button
                            onClick={handleComplete}
                            disabled={
                                isPending || !answers[stepper.current.id]
                            }
                        >
                            {isPending ? 'Generating...' : 'Complete'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    size?: number;
    strokeWidth?: number;
}

const StepIndicator = ({
    currentStep,
    totalSteps,
    size = 80,
    strokeWidth = 6,
}: StepIndicatorProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const fillPercentage = (currentStep / totalSteps) * 100;
    const dashOffset = circumference - (circumference * fillPercentage) / 100;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size}>
                <title>Step Indicator</title>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted-foreground"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="text-primary transition-all duration-300 ease-in-out"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium" aria-live="polite">
                    {currentStep} of {totalSteps}
                </span>
            </div>
        </div>
    );
};
