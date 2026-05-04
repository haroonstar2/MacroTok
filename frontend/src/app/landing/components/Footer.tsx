import { FooterLogo } from "./FooterLogo";
import { FooterDescription } from "./FooterDescription";
import { FooterColumnProduct } from "./FooterColumnProduct";
import { FooterColumnCompany } from "./FooterColumnCompany";
import { FooterColumnLegal } from "./FooterColumnLegal";
import { FooterCopyright } from "./FooterCopyright";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <FooterLogo />
            <FooterDescription />
          </div>
          <FooterColumnProduct />
          <FooterColumnCompany />
          <FooterColumnLegal />
        </div>
        <FooterCopyright />
      </div>
    </footer>
  );
}
