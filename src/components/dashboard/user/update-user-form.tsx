"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserSchema } from "@/lib/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatFieldLabel, getImageKey, useShowToast, validateFileImage } from "@/lib/helper-function";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFiles, uploadFile } from "@/actions/uploadthing";
import { UploadedFileData } from "uploadthing/types";
import { user } from "@/db/schema";
import { updateUserByID } from "@/actions/user";

const ALLOWED_ROLES = ["guest", "contributor", "admin"] as const;

type FormValues = z.infer<typeof UpdateUserSchema>;

interface UpdateUserFormProps {
  user: typeof user.$inferSelect;
}

export const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const [pending, setPending] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null | undefined>(user?.image);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { showErrorToast, showSuccessToast } = useShowToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
      phoneNumber: user?.phoneNumber ?? "",
      role: user?.role as "guest" | "contributor" | "admin",
      image: undefined,
    },
  });

  const handleImageChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      try {
        validateFileImage(file);

        if (preview) {
          URL.revokeObjectURL(preview);
        }

        form.setValue("image", file);

        const url = URL.createObjectURL(file);

        setPreview(url);
      } catch (error) {
        showErrorToast(new Error(error instanceof Error ? error.message : "Unknown error"));
      }
    },
    [form, preview, showErrorToast]
  );

  const handleDeleteImage = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      form.setValue("image", undefined);

      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [form, preview]
  );

  const onSubmit = async (values: FormValues) => {
    setPending(true);

    try {
      let uploadedFile: UploadedFileData | null = null;

      if (values.image) {
        if (user?.image) {
          const imageKey = getImageKey(user.image);

          if (imageKey) await deleteFiles(imageKey);
        }

        uploadedFile = await uploadFile(values.image as File);
      }

      const result = await updateUserByID(
        user.id,
        {
          name: values.name,
          email: values.email,
          role: values.role,
          emailVerified: user.emailVerified,
          phoneNumber: values.phoneNumber,
          image: uploadedFile?.ufsUrl,
        },
        values.password
      );

      if (!result) throw new Error("Something went wrong!");

      showSuccessToast("User updated successfully.");
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setPending(false);
    }
  };

  const fields = Object.keys(UpdateUserSchema._def.schema.shape) as Array<keyof FormValues>;

  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Update User</h1>
        </div>

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="flex flex-col items-center gap-2">
              <FormLabel className="relative inline-block cursor-pointer">
                <Avatar className="h-24 w-24 transition-opacity duration-200 hover:opacity-80">
                  <AvatarImage src={preview || undefined} alt="Preview" />
                  <AvatarFallback className="bg-muted">
                    {preview ? (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    )}
                  </AvatarFallback>
                </Avatar>

                {preview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full transition-opacity duration-200 hover:opacity-90"
                    onClick={handleDeleteImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">Click to {preview ? "change" : "upload"} image</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields
          .filter((field) => field !== "image")
          .map((field) => (
            <FormField
              control={form.control}
              key={field}
              name={field}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel className="font-semibold capitalize">{formatFieldLabel(field)}</FormLabel>
                  <FormControl>
                    {field === "role" ? (
                      <Select onValueChange={fieldProps.onChange} value={fieldProps.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ALLOWED_ROLES.map((role) => (
                            <SelectItem key={role} value={role} className="capitalize">
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={
                          field.toLowerCase().includes("password") ? "password" : field === "email" ? "email" : "text"
                        }
                        placeholder={`Enter your ${formatFieldLabel(field)}`}
                        {...fieldProps}
                        autoComplete="on"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

        <LoadingButton pending={pending}>Create</LoadingButton>
      </form>
    </Form>
  );
};
