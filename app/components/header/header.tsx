import Link from "next/link";

export default function Header() {
  return (
    <div className="shadow-lg  py-5">
      <div className="flex justify-end ml-auto mr-5 gap-4">
        <Link className="hover:text-blue-700" href="/auth/signin">
          Signin
        </Link>
        <Link className="hover:text-blue-700" href="/auth/signup">
          Signup
        </Link>
      </div>
    </div>
  );
}
