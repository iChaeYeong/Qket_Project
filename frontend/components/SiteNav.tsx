"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";

type Props = {
  active?: "events" | "mypage";
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
        <Link href="/" className="siteNavBrand">TicketBox</Link>
        <div className="siteNavLinks">
          <Link
            href="/"
            className={active === "events" ? "siteNavLink siteNavLinkActive" : "siteNavLink"}
          >
            공연
          </Link>
          <Link
            href="/mypage"
            className={active === "mypage" ? "siteNavLink siteNavLinkActive" : "siteNavLink"}
          >
            마이페이지
          </Link>
          <button className="siteNavLink siteNavLogout" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
