"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId || !pwd) { setError("아이디와 비밀번호를 입력하세요."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await login(userId, pwd);
      if (res.success) router.push("/");
      else setError(res.message ?? "로그인에 실패했습니다.");
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authWrap">
      <div className="authBox">
        <p className="authLogo">TicketBox</p>
        <h1 className="authTitle">로그인</h1>
        <p className="authDesc">공연을 예매하려면 로그인이 필요합니다.</p>

        <div className="field">
          <label className="fieldLabel">아이디</label>
          <input
            className="fieldInput"
            placeholder="아이디를 입력하세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="fieldLabel">비밀번호</label>
          <input
            className="fieldInput"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <p className="errorMsg">{error}</p>}

        <button
          className="btnPrimary btnPrimaryFull"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p className="authHelper">
          계정이 없으신가요? <Link href="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
