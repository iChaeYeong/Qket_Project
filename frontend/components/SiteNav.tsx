"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";

export default function SiteNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { userSession, setUserSession } = useAuth();

  // [TODO-NAV-LOGOUT] 로그아웃
  const handleLogout = async () => {
    await logout().catch(() => { });
    setUserSession(null);
    router.push("/");
  };

  return (
    <nav className="siteNav">
      <div className="siteNavInner">
        <Link href="/" className="siteNavBrand">Q-Ket</Link>
        <div className="siteNavLinks">
          <Link href="/" className={pathname === "/" ? "siteNavLink siteNavLinkActive" : "siteNavLink"}>
            공연
          </Link>
          <Link href="/mypage" className={pathname === "/mypage" ? "siteNavLink siteNavLinkActive" : "siteNavLink"}>
            마이페이지
          </Link>

          {userSession ? (
            <>
              {/* [TODO-NAV-USER] 로그인 상태 — 이름 + 로그아웃 */}
              <span className="siteNavUser">{userSession.userNm}님</span>
              <button className="siteNavLink siteNavLogout" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            /* [TODO-NAV-LOGIN] 미로그인 상태 — 로그인 버튼 */
            <Link href="/login" className="siteNavLink siteNavLogin">
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
