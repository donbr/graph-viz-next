// Mirrors the footer in donbr.github.io's Layout.tsx, with the cross-site link pointing back to the portfolio
const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/donbr' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/donbranson/' },
  { label: 'Main Portfolio', href: 'https://donbr.github.io/' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Don Branson. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {footerLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
