import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@/lib/db/schema";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editProfileSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be less than 20 characters"),
  location: z.string()
    .max(160, "Location must be less than 160 characters")
    .nullable(),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof editProfileSchema>;

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
};

export function EditProfileModal({ children, user }: { children: React.ReactNode, user: User }) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      location: user.location || "",
      avatar: user.avatar || "",
    },
  });

  const utils = trpc.useUtils();

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const { mutate: updateProfile, isPending } = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      onOpenChange(false);

      utils.user.getByWalletAddress.invalidate({
        walletAddress: user.walletAddress
      });

      utils.auth.getSession.invalidate();

      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later");
    },
  });

  const handleFileUpload = async (
    file: File,
    fieldName: "avatar",
    setUploading: (value: boolean) => void
  ) => {
    try {
      setUploading(true);
      const url = await uploadFile(file);
      form.setValue(fieldName, url, { shouldDirty: true });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      await handleFileUpload(file, "avatar", setIsUploading);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({
      name: data.name,
      location: data.location || null,
      avatar: data.avatar || null,
    });
  };

  const ImageUploadOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
      <ImageIcon className="h-8 w-8 text-white" />
    </div>
  );

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-muted">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  // Watch the avatar field to get the current value
  const currentAvatar = form.watch("avatar");

  // Create a modified user object with the current form avatar
  const displayUser = {
    ...user,
    avatar: currentAvatar || user.avatar
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center -mt-12 relative z-10">
                <div
                  className="relative rounded-full overflow-hidden cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="relative h-24 w-24">
                    {isUploading ? (
                      <LoadingSpinner />
                    ) : (
                      <UserAvatar
                        user={displayUser}
                        className="h-24 w-24 text-4xl transition-opacity group-hover:opacity-80"
                      />
                    )}
                    <ImageUploadOverlay />
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} maxLength={20} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your location"
                        className="resize-none"
                        maxLength={160}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/160
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending || isUploading}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}