import { DarkModeToggle } from 'jamstacks';
import { izakaya } from '../content/izakaya';
import { SiteLink } from './site-link';

const navigation = [
  { href: '/menu/', label: 'Menu', ja: 'お品書き' },
  { href: '/sake/', label: 'Sake', ja: '日本酒' },
  { href: '/contact/', label: 'Contact', ja: 'お問い合わせ' },
];

/** A short indigo noren strip across the top: the shop name on the left, three links and the theme toggle on the right. */
export function SiteHeader() {
  return (
    <header className="site-header cloth sticky top-0 z-50 shadow-[0_6px_16px_-8px_rgba(0,0,0,.6)]">
      <div className="wrap relative z-10 flex h-(--header-h) items-center justify-between gap-2">
        <SiteLink href="/" className="flex min-w-0 items-baseline gap-2 text-noren-dye no-underline">
          <span lang="ja" className="font-brush text-[1.45rem] leading-none whitespace-nowrap sm:text-[1.6rem]" aria-hidden="true">{izakaya.nameJa}</span>
          <span className="font-mincho text-[.95rem] font-bold tracking-[.06em] whitespace-nowrap max-sm:sr-only">{izakaya.name}</span>
          <span className="sr-only sm:hidden">{izakaya.name}</span>
        </SiteLink>
        <div className="flex items-center gap-1 sm:gap-3 print:hidden">
          <nav aria-label="Main">
            <ul className="flex">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent="section"
                    className="group flex flex-col items-center rounded-ui px-2 py-1 leading-tight font-bold text-on-indigo no-underline hover:bg-white/10 aria-[current]:bg-white/12 xs:px-2.5 sm:px-3">
                    <span lang="ja" className="hidden text-[.62rem] font-normal tracking-[.12em] text-on-indigo-muted lg:block" aria-hidden="true">{item.ja}</span>
                    <span className="border-b-2 border-transparent group-aria-[current]:border-shu">{item.label}</span>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
    </header>
  );
}
