import { APP_CONFIG_DEFAULTS } from '@/app-config';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { companyName, logo, logoDark } = APP_CONFIG_DEFAULTS;

  return (
    <>
      <header className="fixed top-0 left-0 z-50 hidden w-full flex-row justify-between p-6 md:flex">
        <span className="scale-100 transition-transform duration-300 hover:scale-110">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={`${companyName} Logo`} className="block size-6 dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDark ?? logo}
            alt={`${companyName} Logo`}
            className="hidden size-6 dark:block"
          />
        </span>
        <span className="text-foreground font-mono text-xs font-bold tracking-wider uppercase">
          Voice interface for <span className="text-primary">{companyName}</span>
        </span>
      </header>

      {children}
    </>
  );
}
