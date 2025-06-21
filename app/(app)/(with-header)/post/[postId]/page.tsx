'use client';

import { CollectModal } from "@/components/collect-modal";
import { PostUserSection } from "@/components/post-user-section";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { ShareIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();

    const { data: post, isFetching } = trpc.post.detail.useQuery({ id: Number(params.postId) });

    if (isFetching) {
        return <div>Loading...</div>
    }

    const renderLexicalContent = (content: any) => {
        if (!content || !content.root || !content.root.children) {
            return '<p>No content available</p>';
        }

        let html = '';

        content.root.children.forEach((node: any) => {
            if (node.type === 'paragraph') {
                let paragraphContent = '';
                if (node.children && node.children.length > 0) {
                    node.children.forEach((textNode: any) => {
                        if (textNode.text) {
                            let text = textNode.text;
                            if (textNode.format === 1) {
                                text = `<strong>${text}</strong>`;
                            } else if (textNode.format === 2) {
                                text = `<em>${text}</em>`;
                            } else if (textNode.format === 3) {
                                text = `<strong><em>${text}</em></strong>`;
                            }
                            paragraphContent += text;
                        } else if (textNode.type === 'link' && textNode.children) {
                            let linkText = '';
                            textNode.children.forEach((linkChild: any) => {
                                if (linkChild.text) {
                                    linkText += linkChild.text;
                                }
                            });
                            const url = textNode.fields?.url || '#';
                            const newTab = textNode.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
                            paragraphContent += `<a href="${url}"${newTab}>${linkText}</a>`;
                        }
                    });
                }
                html += `<p class="mb-6">${paragraphContent}</p>`;
            } else if (node.type === 'heading') {
                let headingContent = '';
                const headingTag = node.tag || 'h2';

                if (node.children && node.children.length > 0) {
                    node.children.forEach((textNode: any) => {
                        if (textNode.text) {
                            headingContent += textNode.text;
                        }
                    });
                }

                html += `<${headingTag} class="font-bold text-xl sm:text-2xl mt-8 mb-6">${headingContent}</${headingTag}>`;
            } else if (node.type === 'horizontalrule') {
                html += '<hr class="my-8 border-[#333333]/50" />';
            } else if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
                const media = node.fields.media;
                if (media && media.url) {
                    const mediaUrl = media.url.startsWith('/api')
                        ? `${process.env.NEXT_PUBLIC_CMS_API_URL}${media.url}`
                        : media.url;
                    html += `<figure class="my-8">
            <img src="${mediaUrl}" alt="${media.alt || ''}" class="w-full h-auto" />
          </figure>`;
                }
            }
        });

        return html;
    };

    const contentHtml = renderLexicalContent(JSON.parse(post?.content ?? ""));

    return (
        <div className="py-6 space-y-6 max-w-[800px] mx-auto">
            <img className="mx-auto w-full rounded-xl" src={post?.cover} alt={post?.title} />
            <h1 className="text-4xl font-bold">{post?.title}</h1>
            <div className="flex justify-between">
                <PostUserSection post={post} />
                <div className="flex gap-3">
                    <Button variant="outline" size="icon">
                        <ShareIcon className="size-4" />
                    </Button>
                    <CollectModal post={post}>
                        <Button >
                            Collect
                        </Button>
                    </CollectModal>
                </div>

            </div>
            <p className="leading-relaxed text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
    )
}