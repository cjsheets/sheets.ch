import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-foreground text-background p-4">
      <nav className="flex justify-between items-center">
        <div className="text-xl font-bold">My Website</div>
        <div className="flex gap-4">
          <Link className="hover:underline" href="/posts">
            Posts
          </Link>
          <Link className="hover:underline" href="/projects">
            Projects
          </Link>
          <Link className="hover:underline" href="/about">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
