import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-100 px-6 py-8 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold gradient-text mb-1">GetA2PApproved LLC</p>
            <p className="text-xs text-slate-400">1124 Dunn Ave, Cheyenne, WY 82001</p>
            <a href="mailto:support@geta2papproved.com" className="text-xs text-slate-400 hover:text-teal-600 transition-colors">
              support@geta2papproved.com
            </a>
          </div>
          <div className="flex flex-wrap gap-5 text-sm">
            <Link href="/privacy" className="text-slate-500 hover:text-teal-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-teal-600 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/refund" className="text-slate-500 hover:text-teal-600 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center">
          &copy; {new Date().getFullYear()} GetA2PApproved LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
