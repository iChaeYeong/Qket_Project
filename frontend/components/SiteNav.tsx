"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";

type Props = {
  active?: "accounts" | "transfer" | "transactions";
};

export default function SiteNav({ active }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout().catch(() => {});
    router.push("/login");
  };

  return (
    <nav className="siteNav">
      <div className="siteNavInner">
        <Link href="/accounts" className="siteNavBrand">Bank</Link>
        <div className="siteNavLinks">
          <Link
            href="/accounts"
            className={active === "accounts" ? "siteNavLink siteNavLinkActive" : "siteNavLink"}
          >
            계좌
          </Link>
          <Link
            href="/transfer"
            className={active === "transfer" ? "siteNavLink siteNavLinkActive" : "siteNavLink"}
          >
            이체
          </Link>
          <Link
            href="/transactions"
            className={active === "transactions" ? "siteNavLink siteNavLinkActive" : "siteNavLink"}
          >
            거래내역
          </Link>
          <button className="siteNavLink siteNavLogout" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
