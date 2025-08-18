import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-background/95 py-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:gap-4">
        <p>
          &copy; {currentYear} VibeLearn AI. All Rights Reserved.
        </p>
        <p>
          Designed by{' '}
          <Link
            href="https://www.linkedin.com/in/venkata-manoj"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Manoj
          </Link>
        </p>
      </div>
    </footer>
  );
}
