/**
 * Footer.tsx
 * A simple footer shown at the bottom of every page.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer
      style={{ backgroundColor: "oklch(0.22 0.02 261)" }}
      className="text-center py-6 px-6"
    >
      <p className="text-sm" style={{ color: "oklch(0.7 0.02 261)" }}>
        © {year}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 transition-opacity"
          style={{ color: "oklch(0.75 0.1 261)" }}
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}
