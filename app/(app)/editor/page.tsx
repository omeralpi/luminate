"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { trpc } from "@/trpc/client"
import { SerializedEditorState } from "lexical"
import { ImageIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { toast } from "sonner"
import { Editor } from "../../../components/ui/editor"

export const initialValue = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "Hello World 🚀",
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
} as unknown as SerializedEditorState

export default function EditorPage() {
    const router = useRouter()

    const [editorState, setEditorState] =
        useState<SerializedEditorState>(initialValue)

    const [title, setTitle] = useState("")
    const [subTitle, setSubTitle] = useState("")

    const utils = trpc.useUtils()

    const createPost = trpc.post.create.useMutation({
        onSuccess: () => {
            utils.post.list.invalidate()

            router.push("/")
        }
    })

    const [isUploading, setIsUploading] = useState(false)
    const [image, setImage] = useState<string | null>(null)

    const handleFileUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setImage(data.secure_url);
        } catch (error) {
            toast.error('Image upload failed. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-white">
                <div className="container">
                    <div className="flex gap-4 items-center justify-between py-3">
                        <Link href="/" className="flex shrink-0 items-center gap-2">
                            <Logo />
                        </Link>
                        <Separator orientation="vertical" className="!h-[28px] border-gray-500" />
                        <div className="flex-1">
                            Create post
                        </div>
                        <div className="flex gap-2">
                            <Button
                                disabled={createPost.isPending || !title || !subTitle || !editorState}
                                onClick={() => {
                                    createPost.mutate({
                                        title,
                                        content: editorState,
                                        cover: image ?? undefined,
                                    })
                                }}>
                                Publish
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container py-6 space-y-6">
                {image && (
                    <div className="flex flex-col items-start gap-2">
                        <img src={image} alt="Uploaded" className="w-24 h-24 object-cover rounded-lg" />
                        <Button variant={'outline'} className="rounded-full" onClick={() => setImage(null)}>
                            <XIcon className="w-4 h-4" />
                            Remove image
                        </Button>
                    </div>
                )}
                {
                    !image && <Button
                        disabled={isUploading}
                        variant={'outline'} className="rounded-full" onClick={() => {
                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = 'image/*';
                            fileInput.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                    handleFileUpload(file);
                                }
                            };
                            fileInput.click();
                        }}>
                        <ImageIcon className="w-4 h-4" />
                        {isUploading ? 'Uploading...' : 'Add image'}
                    </Button>
                }
                <Input placeholder="Title" className="border-none h-auto outline-none font-bold !text-5xl shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input placeholder="Sub title" className="border-none h-auto outline-none font-bold !text-2xl shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />

                <Suspense>
                    <Editor
                        editorSerializedState={editorState}
                        onSerializedChange={(value) => setEditorState(value)}
                    />
                </Suspense>
            </div>
        </div>
    )
}
