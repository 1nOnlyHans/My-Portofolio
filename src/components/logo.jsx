// HD monogram; same geometry as the page-load screen and public/favicon.svg
export default function Logo({ className }) {
  return (
    <svg viewBox="0 0 144 80" className={className} fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M0 0H14V34H46V0H60V80H46V46H14V80H0Z" />
      <path d="M76 0H100C128 0 144 18 144 40C144 62 128 80 100 80H76ZM90 12V68H100C118 68 130 56 130 40C130 24 118 12 100 12Z" />
    </svg>
  );
}
