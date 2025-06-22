"use client";
import { Button } from "@/components/ui/button";
import { Command, CommandItem } from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { appConfig } from "@/config/app";
import { Check, Link, Mail, Share2, Twitter } from "lucide-react";
import { useState } from "react";

export function Share({ id, className }: { id: string, className?: string }) {
    const shareUrl = `${appConfig.siteUrl}/post/${id}`;
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={className + " max-h-12"}>
                    <Share2 className="w-4 h-1 mr-2" />
                    Share
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 space-y-2">
                <Command>
                    <CommandItem onSelect={copyToClipboard}>
                        {copied ? (
                            <Check className="w-4 h-4 mr-2 text-gray-500" />
                        ) : (
                            <Link className="w-4 h-4 mr-2" />
                        )}
                        Copy Link
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            window.open(
                                `https://twitter.com/share?url=${shareUrl}&text=${document.title}`,
                                "_blank"
                            )
                        }
                    >
                        <Twitter className="w-4 h-4 mr-2 text-blue-500" />
                        Share on Twitter
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            window.open(
                                `mailto:?subject=Check this out&body=${shareUrl}`,
                                "_blank"
                            )
                        }
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Share via Email
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                                "_blank"
                            )
                        }
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                            alt="Facebook"
                            width={16}
                            height={16}
                            className="mr-2"
                        />
                        Share on Facebook
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            window.open(
                                `https://api.whatsapp.com/send?text=${shareUrl}`,
                                "_blank"
                            )
                        }
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                            alt="WhatsApp"
                            width={16}
                            height={16}
                            className="mr-2"
                        />
                        Share on WhatsApp
                    </CommandItem>
                </Command>
            </PopoverContent>
        </Popover>
    );
}