"use client";
import { User } from "@prisma/client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary"; // Import the correct type
import { useForm } from "react-hook-form";
import { updateProfile } from "@/lib/action"; // Import your actual server action

// Define proper types for the form data
interface UpdateFormData {
  name: string;
  surname: string;
  description: string;
  city: string;
  school: string;
  work: string;
  website: string;
  cover?: string;
}

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState(user.cover || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<UpdateFormData>({
    defaultValues: {
      name: user.name || "",
      surname: user.surname || "",
      description: user.description || "",
      city: user.city || "",
      school: user.school || "",
      work: user.work || "",
      website: user.website || "",
    },
  });

  const onSubmit = async (data: UpdateFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      if (cover && cover !== user.cover) {
        formData.append("cover", cover);
      }

      const result = await updateProfile(
        { success: false, error: false },
        formData
      );

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setOpen(false);
          router.refresh();
          reset();
        }, 1500);
      } else {
        setSubmitError("Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    reset();
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== "string") {
      setCover(result.info.secure_url);
    }
  };

  return (
    <div>
      <span
        className="text-blue-700 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        update
      </span>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 w-full max-w-md max-h-[80vh] overflow-y-auto relative"
          >
            <h1 className="text-xl font-bold">Update Profile</h1>

            {/* Cover Picture */}
            <CldUploadWidget
              uploadPreset="social"
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500">Cover picture</label>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => open()}
                  >
                    <Image
                      src={cover || "/icons/nocover.png"}
                      width={48}
                      height={32}
                      className="w-12 h-8 rounded-md object-cover"
                      alt="Cover preview"
                    />
                    <span className="text-xs underline text-gray-600">
                      change
                    </span>
                    <input type="hidden" {...register("cover")} value={cover} />
                  </div>
                </div>
              )}
            </CldUploadWidget>

            {/* Input Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">First name</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Abebe"
                  className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Surname</label>
                <input
                  type="text"
                  {...register("surname")}
                  placeholder="Kebede"
                  className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Description</label>
                <input
                  type="text"
                  {...register("description")}
                  placeholder="Life is Beautiful"
                  className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">City</label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="A.A"
                  className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">School</label>
                <input
                  type="text"
                  {...register("school")}
                  placeholder=""
                  className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Work</label>
                <input
                  type="text"
                  {...register("work")}
                  placeholder="Web Developer"
                  className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Website</label>
                <input
                  type="url"
                  {...register("website")}
                  placeholder="https://example.com"
                  className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                />
              </div>
            </div>

            <UpdateButton isSubmitting={isSubmitting} />

            {submitSuccess && (
              <span className="text-green-500 text-sm">
                Profile has been updated!
              </span>
            )}
            {submitError && (
              <span className="text-red-500 text-sm">{submitError}</span>
            )}

            <button
              type="button"
              className="absolute text-xl right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              ×
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
