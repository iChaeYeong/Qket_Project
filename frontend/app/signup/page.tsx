"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/auth";

export default function SignupPage() {
  const router = useRouter();
  const [userNm, setUserNm] = useState("");
  const [userId, setUserId] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!userNm || !userId || !pwd || !pwdConfirm) { setError("모든 항목을 입력하세요."); return; }
    if (pwd !== pwdConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await register(userId, pwd, userNm);
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
        <p className="authLogo">Banking</p>
        <h1 className="authTitle">회원가입</h1>
        <p className="authDesc">새 계정을 만듭니다.</p>

        <div className="field">
          <label className="fieldLabel">이름</label>
          <input className="fieldInput" placeholder="이름" value={userNm} onChange={(e) => setUserNm(e.target.value)} />
        </div>

        <div className="field">
          <label className="fieldLabel">아이디</label>
          <input className="fieldInput" placeholder="사용할 아이디" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>

        <div className="field">
          <label className="fieldLabel">비밀번호</label>
          <input className="fieldInput" type="password" placeholder="비밀번호" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>

        <div className="field">
          <label className="fieldLabel">비밀번호 확인</label>
          <input className="fieldInput" type="password" placeholder="비밀번호 확인" value={pwdConfirm} onChange={(e) => setPwdConfirm(e.target.value)} />
        </div>

        {error && <p className="errorMsg">{error}</p>}

        <button className="btnPrimary btnPrimaryFull" onClick={handleRegister} disabled={loading}>
          {loading ? "처리 중..." : "가입하기"}
        </button>

        <p className="authHelper">
          이미 계정이 있나요? <Link href="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
