"use client";
import { User } from "@prisma/client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";
import { CldUploadWidget } from "next-cloudinary";
import { useForm } from "react-hook-form";

const updateProfile = async (formData: any) => {

  console.log("Updating profile with:", formData);
  return { success: true, error: false }; // Simulate success
};

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState(user.cover || "");
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
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

  const onSubmit = async (formData: any) => {
    const result = await updateProfile(formData);
    if (result.success) {
      router.refresh(); // Refresh the page to show updated data
      setOpen(false); // Close the modal
    }
  };

  const handleClose = () => {
    setOpen(false);
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
              uploadPreset="socialmedia"
              onSuccess={(result: any) => setCover(result.info.secure_url)}
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
                    <input type="hidden" name="cover" value={cover} />
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

            <UpdateButton />

            {formState.isSubmitSuccessful && (
              <span className="text-green-500 text-sm">
                Profile has been updated!
              </span>
            )}
            {formState.errors && (
              <span className="text-red-500 text-sm">
                Something went wrong!
              </span>
            )}

            <button
              type="button"
              className="absolute text-xl right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={handleClose}
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
