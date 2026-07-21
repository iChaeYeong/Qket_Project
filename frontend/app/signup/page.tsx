"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/auth";

export default function SignupPage() {
  const router = useRouter();
  const [userNm, setUserNm] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!userNm || !userId || !email || !pwd || !pwdConfirm) {
      setError("모든 항목을 입력하세요."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식을 입력하세요."); return;
    }
    if (pwd !== pwdConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await register(userId, pwd, userNm, email);
      if (res.success) router.push("/login");
      else setError(res.message ?? "회원가입에 실패했습니다.");
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
        <h1 className="authTitle">회원가입</h1>
        <p className="authDesc">새 계정을 만들어 공연을 예매하세요.</p>

        <div className="field">
          <label className="fieldLabel">이름</label>
          <input
            className="fieldInput"
            placeholder="실명을 입력하세요"
            value={userNm}
            onChange={(e) => setUserNm(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="fieldLabel">아이디</label>
          <input
            className="fieldInput"
            placeholder="사용할 아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="fieldLabel">이메일</label>
          <input
            className="fieldInput"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="fieldLabel">비밀번호</label>
          <input
            className="fieldInput"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="fieldLabel">비밀번호 확인</label>
          <input
            className="fieldInput"
            type="password"
            placeholder="비밀번호 재입력"
            value={pwdConfirm}
            onChange={(e) => setPwdConfirm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        {error && <p className="errorMsg">{error}</p>}

        <button
          className="btnPrimary btnPrimaryFull"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "처리 중..." : "가입하기"}
        </button>

        <p className="authHelper">
          이미 계정이 있으신가요? <Link href="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
