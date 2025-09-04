// components/UpdateButton.tsx
const UpdateButton = ({ isSubmitting }: { isSubmitting: boolean }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Updating..." : "Update Profile"}
    </button>
  );
};

export default UpdateButton;